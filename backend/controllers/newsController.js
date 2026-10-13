const Article = require("../models/Article");
const { DEFAULT_BG_COLORS } = require("../config/constants");
const {
  slugifyEnglish,
  suggestNewsSlug,
  slugifyManglish,
  isCleanNewsSlug,
} = require("../utils/newsSlug");
const {
  normalizeLang,
  translateOne,
  translateMany,
  translateArticle,
} = require("../utils/translate");
const { warmArticle } = require("../utils/warmTranslations");
const asyncHandler = require("../utils/asyncHandler");

// Helpers
async function withLang(docs, req, full) {
  const lang = normalizeLang(req.query.lang);
  if (!lang) return docs;
  return Promise.all(docs.map((doc) => translateArticle(doc, lang, { full })));
}

function getRandomBgColor() {
  return DEFAULT_BG_COLORS[Math.floor(Math.random() * DEFAULT_BG_COLORS.length)];
}

async function ensureUniqueSlug(baseSlug, excludeId) {
  let candidate = baseSlug;
  let counter = 2;
  while (true) {
    const existing = await Article.findOne({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });
    if (!existing) return candidate;
    candidate = `${baseSlug}-${counter}`;
    counter++;
  }
}

async function findArticleBySlug(slugParam, isAdmin) {
  const filter = isAdmin ? {} : { published: true };

  let article = await Article.findOne({ ...filter, slug: slugParam });
  if (article) return article;

  article = await Article.findOne({ ...filter, legacySlugs: slugParam });
  if (article) return article;

  try {
    const decoded = decodeURIComponent(slugParam);
    if (decoded !== slugParam) {
      article = await Article.findOne({ ...filter, slug: decoded });
      if (article) return article;
      article = await Article.findOne({ ...filter, legacySlugs: decoded });
      if (article) return article;
    }
  } catch {}

  if (slugParam.match(/^[0-9a-fA-F]{24}$/)) {
    article = await Article.findById(slugParam);
    if (article) return article;
  }

  return null;
}

function sanitizeGallery(input) {
  if (!Array.isArray(input)) return [];
  return input.map((u) => String(u).trim()).filter(Boolean).slice(0, 30);
}

/**
 * @desc    Get articles with pagination, filters, and search
 * @route   GET /api/news
 * @access  Public
 */
const getNews = asyncHandler(async (req, res) => {
  const { category, subcategory, featured, breaking, limit = 50, page = 1, search } = req.query;
  const isAdmin = req.headers.authorization?.startsWith("Bearer ");
  const maxLimit = isAdmin ? 2000 : 1000;
  const lim = Math.min(Math.max(parseInt(limit, 10) || 50, 1), maxLimit);
  const pg = Math.max(parseInt(page, 10) || 1, 1);

  const filter = {};
  if (subcategory) filter.subcategory = subcategory;
  if (featured !== undefined) filter.featured = featured === "true";
  if (breaking !== undefined) filter.breaking = breaking === "true";
  if (!isAdmin) filter.published = true;

  const orGroups = [];
  if (category) {
    const cats = String(category).split(",").map((s) => s.trim()).filter(Boolean);
    const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const makeRegexes = (arr) => arr.map((c) => new RegExp("^" + escapeRegExp(c) + "$", "i"));
    if (cats.length === 1) {
      const rx = new RegExp("^" + escapeRegExp(cats[0]) + "$", "i");
      orGroups.push({ $or: [{ category: rx }, { categories: rx }, { categoryMl: rx }] });
    } else if (cats.length > 1) {
      const regexes = makeRegexes(cats);
      orGroups.push({ $or: [{ category: { $in: regexes } }, { categories: { $in: regexes } }, { categoryMl: { $in: regexes } }] });
    }
  }
  if (search) {
    orGroups.push({
      $or: [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    });
  }
  if (orGroups.length === 1) {
    filter.$or = orGroups[0].$or;
  } else if (orGroups.length > 1) {
    filter.$and = orGroups;
  }

  const total = await Article.countDocuments(filter);
  const docs = await Article.find(filter)
    .sort({ createdAt: -1 })
    .skip((pg - 1) * lim)
    .limit(lim)
    .lean({ virtuals: true });

  const news = await withLang(docs.map((d) => ({ ...d, id: d.id || d.slug })), req, false);

  res.json({ news, total, page: pg, limit: lim });
});

/**
 * @desc    Get single article by slug or ObjectId
 * @route   GET /api/news/:slug or GET /api/news/slug/:slug
 * @access  Public
 */
const getNewsBySlug = asyncHandler(async (req, res) => {
  const isAdmin = req.headers.authorization?.startsWith("Bearer ");
  const article = await findArticleBySlug(req.params.slug, isAdmin);

  if (!article) return res.status(404).json({ error: "Article not found" });
  if (!article.published && !isAdmin) return res.status(404).json({ error: "Article not found" });

  const [payload] = await withLang([article.toJSON()], req, true);
  res.json(payload);
});

/**
 * @desc    Create a new article
 * @route   POST /api/news
 * @access  Private (Admin / Editor)
 */
const createNews = asyncHandler(async (req, res) => {
  const {
    title,
    titleEn,
    slug: requestedSlug,
    category,
    categories,
    subcategory,
    content,
    excerpt,
    image,
    gallery,
    tags,
    featured,
    breaking,
    published,
    author,
    date,
    body,
    media,
    videoUrl,
    relatedVideos,
    categoryMl,
    readTime,
    backgroundColor,
    likes,
    views,
    mainNews,
    popular,
  } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ error: "title, category, and content are required" });
  }

  let baseSlug = slugifyEnglish(requestedSlug) || slugifyManglish(title, titleEn);
  if (!baseSlug || /^new-\d{8,}/.test(baseSlug) || baseSlug.includes("---")) {
    baseSlug = slugifyManglish(title, titleEn);
  }
  if (!baseSlug) {
    baseSlug = `news-${Date.now().toString(36)}`;
  }

  const slug = await ensureUniqueSlug(baseSlug);
  const articleCategories = categories && categories.length > 0 ? categories : [category];
  const cleanGallery = sanitizeGallery(gallery);

  const article = await Article.create({
    slug,
    engSlug: slug,
    title,
    titleEn: titleEn || "",
    category,
    categories: articleCategories,
    subcategory: subcategory || "",
    author: author || req.user?.name || "Staff Reporter",
    date: date || new Date().toISOString().split("T")[0],
    image: image || "/images/blog/1.jpg",
    gallery: cleanGallery,
    excerpt: excerpt || content.slice(0, 120),
    content,
    body: body || [],
    tags: tags || [],
    featured: featured === true,
    breaking: breaking === true,
    mainNews: mainNews === true,
    popular: popular === true,
    published: published !== false,
    media: media || "standard",
    videoUrl: videoUrl || "",
    relatedVideos: relatedVideos || [],
    categoryMl: categoryMl || "",
    readTime: readTime || "3 മിനിറ്റ്",
    views: views || 0,
    likes: likes || 0,
    comments: 0,
    backgroundColor: backgroundColor || getRandomBgColor(),
  });

  const payload = article.toJSON();
  warmArticle(payload).catch(() => {});

  res.status(201).json(payload);
});

/**
 * @desc    Update article by id or slug
 * @route   PUT /api/news/:id
 * @access  Private (Admin / Editor)
 */
const updateNews = asyncHandler(async (req, res) => {
  const filter = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };

  const updateData = { ...req.body, updatedAt: new Date().toISOString() };
  if (req.body.gallery !== undefined) {
    updateData.gallery = sanitizeGallery(req.body.gallery);
  }

  const existing = await Article.findOne(filter);
  if (!existing) return res.status(404).json({ error: "Article not found" });

  const requestedSlug = req.body.slug !== undefined ? req.body.slug : req.body.engSlug || "";
  const shouldUpdateSlug = requestedSlug || req.body.titleEn || req.body.title;
  let computedLegacy = null;

  if (shouldUpdateSlug) {
    let baseSlug =
      slugifyEnglish(requestedSlug) ||
      slugifyManglish(req.body.title || existing.title, req.body.titleEn || existing.titleEn);
    if (!baseSlug || /^new-\d{8,}/.test(baseSlug) || baseSlug.includes("---") || !isCleanNewsSlug(baseSlug)) {
      baseSlug = slugifyManglish(req.body.title || existing.title, req.body.titleEn || existing.titleEn);
    }
    if (!baseSlug) return res.status(400).json({ error: "An English title or valid slug is required" });

    const slug = await ensureUniqueSlug(baseSlug, existing._id);
    updateData.slug = slug;
    updateData.engSlug = slug;
    if (slug !== existing.slug) {
      computedLegacy = [...new Set([...(existing.legacySlugs || []), existing.slug].filter(Boolean))];
    }
  }

  delete updateData.legacySlugs;
  delete updateData.slugManuallyEdited;
  if (computedLegacy) updateData.legacySlugs = computedLegacy;

  const article = await Article.findOneAndUpdate(
    filter,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!article) return res.status(404).json({ error: "Article not found" });

  warmArticle(article.toJSON()).catch(() => {});
  res.json(article);
});

/**
 * @desc    Increment article view count
 * @route   PATCH /api/news/:id/view
 * @access  Public
 */
const incrementView = asyncHandler(async (req, res) => {
  const filter = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };

  const article = await Article.findOneAndUpdate(
    filter,
    { $inc: { views: 1 } },
    { new: true, select: "views slug" }
  );

  if (!article) return res.status(404).json({ error: "Article not found" });
  res.json({ views: article.views });
});

/**
 * @desc    Delete article
 * @route   DELETE /api/news/:id
 * @access  Private (Admin / Editor)
 */
const deleteNews = asyncHandler(async (req, res) => {
  const filter = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };

  const article = await Article.findOneAndDelete(filter);
  if (!article) return res.status(404).json({ error: "Article not found" });

  res.json({ message: "Article deleted" });
});

/**
 * @desc    Translate single text string
 * @route   POST /api/news/translate
 * @access  Public
 */
const translateSingle = asyncHandler(async (req, res) => {
  const lang = normalizeLang(req.body?.lang);
  const text = typeof req.body?.text === "string" ? req.body.text : "";
  if (!lang) return res.status(400).json({ error: "Unsupported lang" });

  const translated = await translateOne(text, lang);
  res.json({ translated });
});

/**
 * @desc    Translate array of text strings
 * @route   POST /api/news/translate-batch
 * @access  Public
 */
const translateBatch = asyncHandler(async (req, res) => {
  const lang = normalizeLang(req.body?.lang);
  const texts = Array.isArray(req.body?.texts) ? req.body.texts : [];
  if (!lang) return res.status(400).json({ error: "Unsupported lang" });

  const translations = await translateMany(texts, lang);
  res.json({ translations });
});

/**
 * @desc    Migrate old and malformed slugs
 * @route   POST /api/news/migrate-slugs
 * @access  Private (Admin)
 */
const migrateSlugs = asyncHandler(async (_req, res) => {
  const articles = await Article.find({});
  let updated = 0;
  let skipped = 0;

  for (const article of articles) {
    let baseSlug =
      slugifyManglish(article.title, article.titleEn) ||
      (isCleanNewsSlug(article.engSlug) ? article.engSlug : "");
    if (!baseSlug || /^new-\d{8,}/.test(baseSlug) || baseSlug.includes("---")) {
      baseSlug = slugifyManglish(article.title, article.titleEn);
    }
    if (!baseSlug) {
      skipped++;
      continue;
    }
    const isBad =
      /^new-\d{8,}/.test(article.slug) ||
      article.slug.includes("---") ||
      !isCleanNewsSlug(article.slug);

    const slug = await ensureUniqueSlug(baseSlug, article._id);
    if (slug !== article.slug || isBad) {
      await Article.updateOne(
        { _id: article._id },
        {
          $set: {
            slug,
            engSlug: slug,
            legacySlugs: [...new Set([...(article.legacySlugs || []), article.slug].filter(Boolean))],
          },
        }
      );
      updated++;
    }
  }

  res.json({ message: "Migration complete", updated, skipped, total: articles.length });
});

module.exports = {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  incrementView,
  deleteNews,
  translateSingle,
  translateBatch,
  migrateSlugs,
};
