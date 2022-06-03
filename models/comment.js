const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// this is a subdocument and the reason why we initialize it befor the commentSchema because, we need to init something before we can invoque it
const ReplySchema = new Schema( 
  {
    // set custom id to avoid confusion with parent comment _id.  just to remember that this schema is not a new table
    replyId: { 
      type: Schema.Types.ObjectId, // this is a way to create another id, because mangoose wont create ID's for you when it comes to subdocuments
      default: () => new Types.ObjectId()
    },
    replyBody: {
      type: String,
      required: true,
      trim: true
    },
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal) // this is where we will use the getter 
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);


// commentSchema model, that will hold every comment that a user provides, this model has a reffernce to the reply that is on the top
const CommentSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    commentBody: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    // use ReplySchema to validate data for a reply ( this will give us the data of any reply from the reply schema)
    replies: [ReplySchema]
  },
  {
    toJSON: {
      virtuals: true, // with this we can have access to use virtuals 
      getters: true  //  with this we can have access to use getters
    },
    id: false //We set id to false because this is a virtual that Mongoose returns, and we don’t need it
  }
);

// create a virtual thaat will be called replyCount ( this virtual will give us the length of the replies, and it will be always available on
// the commentSchema da)
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

const Comment = model('Comment', CommentSchema);

module.exports = Comment;
