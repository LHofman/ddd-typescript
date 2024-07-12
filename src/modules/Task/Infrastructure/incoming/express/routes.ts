import express from 'express';
import { TaskQuery } from '../../outgoing/hardcoded/Query/TaskQuery';
import { TaskId } from '../../../Vocabulary/TaskId';
import { CreateTaskCommandHandler } from '../../../Application/Command/CreateTask/CreateTaskCommandHandler';
import { TaskRepository } from '../../outgoing/hardcoded/Repository/TaskRepository';
import { CreateTaskCommandDTO } from '../../../Application/Port/Command/CreateTask/CreateTaskCommandDTO';
import { UpdateTaskCommandDTO } from '../../../Application/Port/Command/UpdateTask/UpdateTaskCommandDTO';
import { UpdateTaskCommandHandler } from '../../../Application/Command/UpdateTask/UpdateTaskCommandHandler';
import { DeleteTaskCommandHandler } from '../../../Application/Command/DeleteTask/DeleteTaskCommandHandler';
import { DeleteTaskCommandDTO } from '../../../Application/Port/Command/DeleteTask/DeleteTaskCommandDTO';
import { AddSubTaskCommandHandler } from '../../../Application/Command/AddSubTask/AddSubTaskCommandHandler';
import { AddSubTaskCommandDTO } from '../../../Application/Port/Command/AddSubTask/AddSubTaskCommandDTO';

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

  const taskId = parseInt(req.params.id);
  if (isNaN(taskId)) {
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

router.put('/:id/addSubTask', async (req, res) => {
  const addSubTaskCommandHandler = new AddSubTaskCommandHandler(new TaskRepository());

  const taskId = parseInt(req.params.id);
  const subTaskId = parseInt(req.body.subTaskId);
  
  if (isNaN(taskId) || isNaN(subTaskId)) {
    res.status(400).send('Invalid ID');
    return;
  }

  const addSubTaskCommandDTO: AddSubTaskCommandDTO = {id: taskId, subTaskId };
  const result = await addSubTaskCommandHandler.handle(addSubTaskCommandDTO);
  if (result.isFailure) {
    res.status(400).send(result.getErrors().join(', '));
    return;
  }

  res.send('SubTask successfully added to Task');
});

router.put('/:id', async (req, res) => {
  const updateTaskCommandHandler = new UpdateTaskCommandHandler(new TaskRepository());

  const taskId = parseInt(req.params.id);
  if (isNaN(taskId)) {
    res.status(400).send('Invalid ID');
    return;
  }

  const updateTaskCommandDTO: UpdateTaskCommandDTO = {
    id: taskId,
    description: req.body.description,
  };

  const result = await updateTaskCommandHandler.handle(updateTaskCommandDTO);
  if (result.isFailure) {
    res.status(400).send(result.getErrors().join(', '));
  }

  res.send('Task successfully updated');
});

router.delete('/:id', (req, res) => {
  const deleteTaskCommandHandler = new DeleteTaskCommandHandler(new TaskRepository());

  const taskId = parseInt(req.params.id);
  if (isNaN(taskId)) {
    res.status(400).send('Invalid ID');
    return;
  }

  const deleteTaskCommandDTO: DeleteTaskCommandDTO = { id: taskId };

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
