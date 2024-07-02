import express from 'express';
import { TaskQuery } from '../../outgoing/hardcoded/Query/TaskQuery';
import { TaskId } from '../../../Vocabulary/TaskId';
import { CreateTaskCommandHandler } from '../../../Application/Command/CreateTask/CreateTaskCommandHandler';
import { TaskRepository } from '../../outgoing/hardcoded/Repository/TaskRepository';
import { CreateTaskCommandDTO } from '../../../Application/Port/Command/CreateTask/CreateTaskCommandDTO';
import { UpdateTaskCommandDTO } from '../../../Application/Port/Command/UpdateTask/UpdateTaskCommandDTO';
import { UpdateTaskCommandHandler } from '../../../Application/Command/CreateTask/UpdateTaskCommandHandler';
import { DeleteTaskCommandHandler } from '../../../Application/Command/CreateTask/DeleteTaskCommandHandler';
import { DeleteTaskCommandDTO } from '../../../Application/Port/Command/DeleteTask/DeleteTaskCommandDTO';

const router = express.Router();

router.get('/', async (req, res) => {
  const taskQuery = new TaskQuery();

  const tasks = await taskQuery.findAll();
  res.send(tasks);
});

router.get('/:id', async (req, res) => {
  const taskQuery = new TaskQuery();

  if (isNaN(Number(req.params.id))) {
    res.status(400).send('Invalid ID');
    return;
  }

  const taskIdOrError = TaskId.create(Number(req.params.id));
  if (taskIdOrError.isFailure) {
    res.status(400).send('Invalid ID');
    return;
  }

  const task = await taskQuery.findById(taskIdOrError.getValue());
  if (!task) {
    res.status(404).send('Invalid ID');
    return;
  }

  res.send(task);
});

router.post('/', async (req, res) => {
  const createTaskCommandHandler = new CreateTaskCommandHandler(new TaskRepository());

  const createTaskCommandDTO: CreateTaskCommandDTO = {
    description: req.body.description,
  };

  const taskOrError = await createTaskCommandHandler.handle(createTaskCommandDTO);
  if (taskOrError.isFailure) {
    res.status(400).send(taskOrError.getErrors());
  }

  const task = taskOrError.getValue();

  res.send({ id: task.toSnapshot().props.id.getId() });
});

router.put('/:id/start', async (req, res) => {
  const updateTaskCommandHandler = new UpdateTaskCommandHandler(new TaskRepository());

  let taskId: number;
  try {
    taskId = parseInt(req.params.id);
  } catch (e) {
    res.status(400).send('Invalid ID');
    return;
  }

  const result = await updateTaskCommandHandler.start(taskId);
  if (result.isFailure) {
    res.status(400).send(result.getErrors().join(', '));
    return;
  }

  res.send('Task successfully started');
});

router.put('/:id', async (req, res) => {
  const updateTaskCommandHandler = new UpdateTaskCommandHandler(new TaskRepository());

  let updateTaskCommandDTO: UpdateTaskCommandDTO;
  try {
    updateTaskCommandDTO = {
      id: parseInt(req.params.id),
      description: req.body.description,
    };
  } catch (e) {
    res.status(400).send('Invalid ID');
    return;
  }

  const result = await updateTaskCommandHandler.handle(updateTaskCommandDTO);
  if (result.isFailure) {
    res.status(400).send(result.getErrors().join(', '));
  }

  res.send('Task successfully updated');
});

router.delete('/:id', (req, res) => {
  const deleteTaskCommandHandler = new DeleteTaskCommandHandler(new TaskRepository());

  let deleteTaskCommandDTO: DeleteTaskCommandDTO;
  try {
    deleteTaskCommandDTO = {
      id: parseInt(req.params.id),
    };
  } catch (e) {
    res.status(400).send('Invalid ID');
    return;
  }

  const resultPromise = deleteTaskCommandHandler.handle(deleteTaskCommandDTO);
  resultPromise.then((result) => {

    if (result.isFailure) {
      res.status(404).send(result.getErrors().join(', '));
      return;
    }

    res.send('Task successfully deleted');
  });
});

export default router;
