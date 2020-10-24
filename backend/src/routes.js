import fetch from 'node-fetch';
import uuid from 'uuid';
import { Keystore } from '@withkoji/vcc';
import { Database } from '@withkoji/database';

export default function (app) {
  // Retrieve all answered questions
  app.get('/questions', async (req, res) => {
    try {
      const db = new Database();
      const questions = (await db.get('questions'))
        .filter(({ dateAnswered }) => dateAnswered)
        .sort((a, b) => a.dateAnswered - b.dateAnswered);

      res.status(200).json({
        questions,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // Ask a question
  app.post('/ask', async (req, res) => {
    try {
      if (!req.body.question) {
        res.sendStatus(400);
        return;
      }

      const insertData = {
        question: req.body.question,
        datePosted: Math.floor(Date.now() / 1000),
        dateAnswered: null,
      };

      const db = new Database();
      await db.set('questions', uuid.v4(), insertData);

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  //
  // Admin routes
  //
  // Get all questions, including unanswered questions
  app.get('/admin/questions', async (req, res) => {
    try {
      // Verify admin
      if (req.headers.authorization !== 'adminToken') {
        res.sendStatus(401);
        return;
      }

      const db = new Database();
      const questions = (await db.get('questions'))
        .sort((a, b) => a.datePosted - b.datePosted);

      const unansweredQuestions = questions.filter(({ dateAnswered }) => !dateAnswered);
      const answeredQuestions = questions.filter(({ dateAnswered }) => dateAnswered);

      res.status(200).json({
        unansweredQuestions,
        answeredQuestions,
      });
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // Answer a question
  app.post('/admin/answer', async (req, res) => {
    try {
      // Verify admin
      if (req.headers.authorization !== 'adminToken') {
        res.sendStatus(401);
        return;
      }

      const {
        questionId,
        answer,
      } = req.body;

      if (!questionId || !answer) {
        res.sendStatus(400);
        return;
      }

      const db = new Database();
      await db.update(
        'questions',
        questionId,
        {
          answer,
          dateAnswered: Math.floor(Date.now() / 1000),
        },
      );

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });

  // Remove a question
  app.post('/admin/remove', async (req, res) => {
    try {
      // Verify admin
      if (req.headers.authorization !== 'adminToken') {
        res.sendStatus(401);
        return;
      }

      const {
        questionId,
      } = req.body;

      if (!questionId) {
        res.sendStatus(400);
        return;
      }

      const db = new Database();
      await db.delete('questions', questionId);

      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }
  });
}
