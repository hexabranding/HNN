const Ad = require("../models/Ad");
const { DEFAULT_AD_SLOTS } = require("../config/constants");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get active ads
 * @route   GET /api/ads
 * @access  Public
 */
const getActiveAds = asyncHandler(async (_req, res) => {
  const ads = await Ad.find({ active: true }).sort({ slot: 1 });
  res.json(ads.map((a) => a.toJSON()));
});

/**
 * @desc    Get all ads (including inactive)
 * @route   GET /api/ads/all
 * @access  Private (Admin)
 */
const getAllAds = asyncHandler(async (_req, res) => {
  const ads = await Ad.find().sort({ slot: 1 });
  res.json(ads.map((a) => a.toJSON()));
});

/**
 * @desc    Get predefined standard ad slots
 * @route   GET /api/ads/slots
 * @access  Public
 */
const getAdSlots = asyncHandler(async (_req, res) => {
  res.json(DEFAULT_AD_SLOTS);
});

/**
 * @desc    Get batch ads grouped by requested slot identifiers
 * @route   GET /api/ads/batch?slots=s1,s2
 * @access  Public
 */
const getAdsBySlotsBatch = asyncHandler(async (req, res) => {
  const slotsParam = req.query.slots;
  if (!slotsParam) {
    return res.status(400).json({ error: "slots query param is required" });
  }

  const slots = slotsParam.split(",").map((s) => s.trim()).filter(Boolean);
  const ads = await Ad.find({ slot: { $in: slots }, active: true });

  const adsMap = {};
  ads.forEach((a) => {
    if (!adsMap[a.slot]) adsMap[a.slot] = [];
    adsMap[a.slot].push(a.toJSON());
  });

  res.json(adsMap);
});

/**
 * @desc    Get single ad by id or slot name
 * @route   GET /api/ads/:id
 * @access  Public
 */
const getAdByIdOrSlot = asyncHandler(async (req, res) => {
  let ad = /^[0-9a-fA-F]{24}$/.test(req.params.id)
    ? await Ad.findById(req.params.id)
    : null;

  if (!ad) ad = await Ad.findOne({ slot: req.params.id, active: true });
  if (!ad) return res.status(404).json({ error: "Ad not found" });

  res.json(ad.toJSON());
});

/**
 * @desc    Create a new ad slot
 * @route   POST /api/ads
 * @access  Private (Admin)
 */
const createAd = asyncHandler(async (req, res) => {
  const { slot, title, image, link, active, label } = req.body;
  if (!slot) return res.status(400).json({ error: "slot is required" });

  const ad = new Ad({
    slot: slot.trim(),
    title: title || "",
    image: image || "",
    link: link || "",
    active: active !== false,
    label: label || "",
  });

  await ad.save();
  res.status(201).json(ad.toJSON());
});

/**
 * @desc    Update ad
 * @route   PUT /api/ads/:id
 * @access  Private (Admin)
 */
const updateAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findByIdAndUpdate(
    req.params.id,
    { ...req.body, _id: req.params.id },
    { new: true, runValidators: true }
  );

  if (!ad) return res.status(404).json({ error: "Ad not found" });
  res.json(ad.toJSON());
});

/**
 * @desc    Delete ad
 * @route   DELETE /api/ads/:id
 * @access  Private (Admin)
 */
const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  if (!ad) return res.status(404).json({ error: "Ad not found" });

  res.json({ message: "Ad deleted" });
});

module.exports = {
  getActiveAds,
  getAllAds,
  getAdSlots,
  getAdsBySlotsBatch,
  getAdByIdOrSlot,
  createAd,
  updateAd,
  deleteAd,
};
