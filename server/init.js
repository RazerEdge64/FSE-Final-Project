// Setup database with initial test data.
// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags')
let Answer = require('./models/answers')
let Question = require('./models/questions')
let User = require('./models/user');
let Comment = require('./models/comments');



let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// let tags = [];
// let answers = [];

function tagCreate(name, user_id) {
  let tag = new Tag({ name: name, created_by : user_id });
  return tag.save();
}

function answerCreate(text, ans_by, votes, comments, ans_date_time) {
  let answerDetail = {
    text: text,
    ans_by: ans_by,
    votes: votes || 0,
    comments: comments,
    ans_date_time: ans_date_time || new Date()
  };

  let answer = new Answer(answerDetail);
  return answer.save();
}



function commentCreate(text, user, date_time, votes) {
  let commentDetail = {
    text: text,
    user: user,
    date_time: date_time || new Date(),
    votes: votes || 0
  };
  let comment = new Comment(commentDetail);
  return comment.save();
}


// function questionCreate(title, text, tags, answers, asked_by, votes, ask_date_time, views) {
//   let qstnDetail = {
//     title: title,
//     text: text,
//     tags: tags,
//     answers: answers || [],
//     asked_by: asked_by,
//     votes: votes || 0,
//     ask_date_time: ask_date_time || new Date(),
//     views: views || 0,
//     last_activity: ask_date_time || new Date()
//   };
//
//   let qstn = new Question(qstnDetail);
//   return qstn.save();
// }

function questionCreate(title, text, tags, answers, asked_by, votes, ask_date_time, views, comments) {
  let qstnDetail = {
    title: title,
    text: text,
    tags: tags,
    answers: answers || [],
    asked_by: asked_by,
    votes: votes || 0,
    ask_date_time: ask_date_time || new Date(),
    views: views || 0,
    comments: comments
  };

  let qstn = new Question(qstnDetail);
  return qstn.save();
}


function userCreate(username, email, password, rep, joinDate) {
    let userdetail = {
      username: username,
      email: email,
      password: password,
      reputation: rep,
      joinDate: joinDate,
    }

    let nUser = new User(userdetail);
    return nUser.save();
    
  }

// const populate = async () => {
//   try {
//     // Create users
//     let user1 = await userCreate('user1', 'user1@example.com', '123456', 100, new Date());
//     let user2 = await userCreate('user2', 'user2@example.com', '123456', 50, new Date());
//     let user3 = await userCreate('user3', 'user3@example.com', '123456', 1, new Date());
//
//     // Create multiple tags for each user
//     let tagsUser1 = [];
//     let tagsUser2 = [];
//     for (let i = 1; i <= 5; i++) {
//       let tagUser1 = await tagCreate(`tag${i}user1`, user1._id);
//       tagsUser1.push(tagUser1._id);
//       let tagUser2 = await tagCreate(`tag${i}user2`, user2._id);
//       tagsUser2.push(tagUser2._id);
//     }
//
//     // Create multiple questions, answers, and comments for user1
//     const today = new Date();
//     for (let i = 1; i <= 10; i++) {
//       let answer = await answerCreate(`Answer Text ${i} for Q${i}`, user1.username, i, [], new Date());
//
//       // Create a comment for each answer
//       let comment = await commentCreate(`Comment on A${i}`, user2._id, new Date(), i);
//       answer.comments.push(comment._id);
//       await answer.save();
//
//       // Use a subset of tags for each question
//       let questionTags = i % 2 === 0 ? tagsUser1 : tagsUser2;
//
//       // Create a date for each question, decrementing by one day for each subsequent question
//       let questionDate = new Date(today);
//       questionDate.setDate(today.getDate() - i);
//
//       await questionCreate(`Question Title ${i}`, `Question Text ${i}`, questionTags, [answer._id], user1.username, i * 10, questionDate, i * 5);
//     }
//
//     console.log('Database populated successfully.');
//   } catch (error) {
//     console.error('ERROR: ' + error);
//   } finally {
//     if (db) db.close();
//   }
// };
const populate = async () => {
  try {

    let user1 = await userCreate('user1', 'user1@example.com', '123456', 100, new Date());
    let user2 = await userCreate('user2', 'user2@example.com', '123456', 50, new Date());
    let user3 = await userCreate('user3', 'user3@example.com', '123456', 1, new Date());

    let tagsUser1 = [];
    let tagsUser2 = [];
    for (let i = 1; i <= 5; i++) {
      let tagUser1 = await tagCreate(`tag${i}user1`, user1._id);
      tagsUser1.push(tagUser1._id);
      let tagUser2 = await tagCreate(`tag${i}user2`, user2._id);
      tagsUser2.push(tagUser2._id);
    }

    const today = new Date();
    for (let i = 1; i <= 10; i++) {
      let questionComments = [];
      let numberOfComments = i === 1 ? 6 : 3;
      for (let j = 0; j < numberOfComments; j++) {
        let questionComment = await commentCreate(`Comment ${j} on Q${i}`, user2._id, new Date(), j);
        questionComments.push(questionComment._id);
      }

      let questionAnswers = [];
      let answerCount = i === 1 ? 2 : 1;
      for (let k = 1; k <= answerCount; k++) {
        let answer = await answerCreate(`Answer Text ${k} for Q${i}`, user1.username, k, [], new Date());
        let comment = await commentCreate(`Comment on A${k}`, user2._id, new Date(), k);
        answer.comments.push(comment._id);
        await answer.save();
        questionAnswers.push(answer._id);
      }

      let questionTags = i % 2 === 0 ? tagsUser1 : tagsUser2;
      let questionDate = new Date(today);
      questionDate.setDate(today.getDate() - i);

      await questionCreate(
          `Question Title ${i}`,
          `Question Text ${i}`,
          questionTags,
          questionAnswers,
          user1.username,
          i * 10,
          questionDate,
          i * 5,
          questionComments
      );
    }

    let tag11 = await tagCreate('tag11', user3._id);
    let answer11 = await answerCreate('Answer Text 11 for Q11', user3.username, 0, [], new Date());
    let commentForAnswer11 = await commentCreate('Comment on A11', user1._id, new Date(), 0);
    answer11.comments.push(commentForAnswer11._id);
    await answer11.save();

    let commentForQuestion11 = await commentCreate('Comment on Q11', user2._id, new Date(), 0);
    let question11Date = new Date(today);
    question11Date.setDate(today.getDate() - 11);

    await questionCreate(
        'Question Title 11',
        'Question Text 11',
        [tag11._id],
        [answer11._id],
        user3.username,
        0,
        question11Date,
        0,
        [commentForQuestion11._id]
    );

    console.log('Database populated successfully.');
  } catch (error) {
    console.error('ERROR: ' + error);
  } finally {
    if (db) db.close();
  }
};



populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');
