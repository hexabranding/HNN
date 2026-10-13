const Setting = require("../models/Setting");
const { DEFAULT_SETTINGS } = require("../config/constants");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @desc    Get key-value settings map for public consumption
 * @route   GET /api/settings
 * @access  Public
 */
const getSettings = asyncHandler(async (_req, res) => {
  const settings = await Setting.find().sort({ key: 1 });
  const obj = {};
  settings.forEach((s) => {
    obj[s.key] = s.value;
  });
  res.json(obj);
});

/**
 * @desc    Get all detailed settings with type metadata for admin portal
 * @route   GET /api/settings/all
 * @access  Public (or Private)
 */
const getAllSettings = asyncHandler(async (_req, res) => {
  const settings = await Setting.find().sort({ key: 1 });
  res.json(settings);
});

/**
 * @desc    Update single setting by key
 * @route   PUT /api/settings/:key
 * @access  Private (Admin)
 */
const updateSetting = asyncHandler(async (req, res) => {
  const existing = await Setting.findOne({ key: req.params.key });
  const update = { value: req.body.value };

  if (existing) {
    if (existing.label) update.label = existing.label;
    if (existing.type) update.type = existing.type;
    if (existing.options) update.options = existing.options;
  }

  const setting = await Setting.findOneAndUpdate(
    { key: req.params.key },
    update,
    { new: true, upsert: true }
  );

  res.json(setting);
});

/**
 * @desc    Seed default settings
 * @route   POST /api/settings/seed
 * @access  Private (Admin)
 */
const seedSettings = asyncHandler(async (_req, res) => {
  for (const d of DEFAULT_SETTINGS) {
    await Setting.findOneAndUpdate({ key: d.key }, d, { upsert: true, new: true });
  }
  res.json({ message: "Settings seeded" });
});

module.exports = {
  getSettings,
  getAllSettings,
  updateSetting,
  seedSettings,
};
