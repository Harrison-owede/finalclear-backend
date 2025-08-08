const cloudinary = require("../utilities/cloudinary");

const getPrivateFile = async (req, res) => {
  const { public_id } = req.query;

  if (!public_id) {
    return res.status(400).json({ error: "public_id query is required" });
  }

  try {
    const url = cloudinary.url(public_id, {
      secure: true,
      type: "authenticated",
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 10, // valid for 10 minutes
    });

    return res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate secure file URL" });
  }
};

module.exports = { getPrivateFile };

