const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        communityId: {
            type: String,
            required: true,
        },
        creatorAddress: {
            type: String,
            required: true,
        },
        like: {
            type: Number,
            default: 0,
        },
        title: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)


module.exports = mongoose.model("Post", postSchema);