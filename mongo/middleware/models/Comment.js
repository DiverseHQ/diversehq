const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Post',
        },
        commentorAddress: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        appreciateAmount: {
            type: Number,
            default: 0,
        }

    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Comment", commentSchema);
