import express from 'express';
import tasksRoutes from './modules/Task/Infrastructure/incoming/express/routes';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use('/tasks', tasksRoutes);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

export default app;
