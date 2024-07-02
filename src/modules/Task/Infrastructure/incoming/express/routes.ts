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

router.get('/', (req, res) => {
  const taskQuery = new TaskQuery();

  const tasksPromise = taskQuery.findAll();
  tasksPromise.then((tasks) => {
    res.send(tasks);
  });
});

router.get('/:id', (req, res) => {
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

  const taskPromise = taskQuery.findById(taskIdOrError.getValue());
  taskPromise.then((task) => {
    if (!task) {
      res.status(404).send('Invalid ID');
      return;
    }

    res.send(task);
  });
});

router.post('/', (req, res) => {
  const createTaskCommandHandler = new CreateTaskCommandHandler(new TaskRepository());

  const createTaskCommandDTO: CreateTaskCommandDTO = {
    description: req.body.description,
  };

  const taskPromise = createTaskCommandHandler.handle(createTaskCommandDTO);
  taskPromise.then((taskOrError) => {
    if (taskOrError.isFailure) {
      res.status(400).send(taskOrError.getErrors());
    }

    const task = taskOrError.getValue();

    res.send({ id: task.toSnapshot().props.id.getId() });
  });
});

router.put('/:id', (req, res) => {
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

  const taskPromise = updateTaskCommandHandler.handle(updateTaskCommandDTO);
  taskPromise.then((taskOrError) => {
    if (taskOrError.isFailure) {
      res.status(400).send(taskOrError.getErrors());
    }

    res.send('Task successfully updated');
  });
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
