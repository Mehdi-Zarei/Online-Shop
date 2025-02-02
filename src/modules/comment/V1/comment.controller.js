const { isValidObjectId } = require("mongoose");
const commentModel = require("../../../../models/comment");
const productModel = require("../../../../models/product");

//* Helper Functions
const { createPagination } = require("../../../helpers/pagination");

const {
  errorResponse,
  successResponse,
} = require("../../../helpers/responseMessage");

exports.getAllComments = async (req, res, next) => {
  try {
    const { productID, page = 1, limit = 10 } = req.query;

    if (!isValidObjectId(productID)) {
      return errorResponse(res, 409, "Product ID Not Valid !!");
    }

    const mainProduct = await productModel.findById(productID);

    if (!mainProduct) {
      return errorResponse(res, 404, "Product Not Found With This ID !!");
    }

    const comments = await commentModel
      .find({ product: productID, isAccept: true }, "-__v -product")
      .populate("user", "name")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    comments.forEach((comment) => {
      comment.replies = comment.replies.filter(
        (reply) => reply.isAccept === true
      );
    });

    if (comments.length === 0) {
      return successResponse(
        res,
        200,
        "This Product Don't Have Any Comment Yet !!"
      );
    }

    const pagination = createPagination(
      page,
      limit,
      comments.length,
      "Comments"
    );

    return successResponse(res, 200, { comments, pagination });
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const { productID, content, score } = req.body;

    if (!isValidObjectId(productID)) {
      return errorResponse(res, 409, "Product ID Not valid !!");
    }

    const userID = req.user._id;

    const mainProduct = await productModel.findById(productID);

    if (!mainProduct) {
      return errorResponse(res, 404, "Product Not Found !!");
    }

    const isTheCommentDuplicate = await commentModel.findOne({ content });

    if (isTheCommentDuplicate) {
      return errorResponse(
        res,
        409,
        "You have already posted another comment with this content."
      );
    }

    const newComment = await commentModel.create({
      user: userID,
      product: productID,
      isAccept: false,
      score,
      content,
      replies: [],
    });

    return successResponse(res, 201, "New Comment Created Successfully.", {
      Comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

exports.setCommentStatus = async (req, res, next) => {
  try {
    const { commentID } = req.params;
    const { isAccept } = req.body;

    if (!isValidObjectId(commentID)) {
      return errorResponse(res, 409, "Comment ID Not Valid !!");
    }

    const updateCommentStatus = await commentModel.findByIdAndUpdate(
      commentID,
      { isAccept }
    );

    if (!updateCommentStatus) {
      return errorResponse(res, 404, "Comment Not Found !!");
    }

    if (isAccept === true) {
      return successResponse(res, 200, "Comment Accepted Successfully.");
    } else {
      return successResponse(res, 200, "Comment Rejected Successfully.");
    }
  } catch (error) {
    next(error);
  }
};

exports.removeComment = async (req, res, next) => {
  try {
    const { commentID } = req.params;

    if (!isValidObjectId(commentID)) {
      return errorResponse(res, 409, "Comment ID Not Valid !!");
    }

    const deletedComment = await commentModel.findByIdAndDelete(commentID);

    if (!deletedComment) {
      return errorResponse(res, 404, "Comment Not Fond with This ID !!");
    }

    return successResponse(res, 200, "Comment Removed Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.addReply = async (req, res, next) => {
  try {
    const { commentID } = req.params;
    const { content } = req.body;
    const userID = req.user._id;

    if (!isValidObjectId(commentID)) {
      return errorResponse(res, 409, "Comment ID Not Valid !!");
    }

    const isReplyDuplicate = await commentModel.findOne({
      _id: commentID,
      replies: {
        $elemMatch: { content: content, user: userID },
      },
    });

    if (isReplyDuplicate) {
      return errorResponse(
        res,
        409,
        "You have already posted a similar reply to this comment."
      );
    }

    const reply = await commentModel.findByIdAndUpdate(
      commentID,
      {
        $push: {
          replies: {
            user: userID,
            content,
            isAccept: false,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!reply) {
      return errorResponse(res, 404, "Comment Not Found !!");
    }

    return successResponse(res, 201, "Reply Comment Created Successfully.", {
      ReplyComment: reply.replies,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeReply = async (req, res, next) => {
  try {
    const { commentID, replyID } = req.params;

    if (!isValidObjectId(commentID) || !isValidObjectId(replyID)) {
      return errorResponse(res, 409, "Comment Or Reply ID Not Valid !!");
    }

    const mainComment = await commentModel.findById(commentID);

    if (!mainComment) {
      return errorResponse(res, 404, "Comment Not Found !!");
    }

    const mainReply = mainComment.replies.id(replyID);

    if (!mainReply) {
      return errorResponse(res, 404, "Reply Comment Not Found !!");
    }

    mainComment.replies.pull(replyID);
    await mainComment.save();

    return successResponse(res, 200, "Reply Comment Removed Successfully.");
  } catch (error) {
    next(error);
  }
};

exports.setReplyCommentStatus = async (req, res, next) => {
  try {
    const { commentID, replyID } = req.params;
    const { isAccept } = req.body;

    if (!isValidObjectId(commentID) || !isValidObjectId(replyID)) {
      return errorResponse(res, 409, "Comment Or Reply ID Not Valid !!");
    }

    const mainComment = await commentModel.findById(commentID);

    if (!mainComment) {
      return errorResponse(res, 404, "Comment Not Found !!");
    }

    const mainReply = mainComment.replies.id(replyID);

    if (!mainReply) {
      return errorResponse(res, 404, "Reply Comment Not Found !!");
    }

    mainReply.isAccept = isAccept;
    await mainComment.save();

    if (isAccept === true) {
      return successResponse(res, 200, "Reply Comment Accepted Successfully.");
    } else {
      return successResponse(res, 200, "Reply Comment Rejected Successfully.");
    }
  } catch (error) {
    next(error);
  }
};
