const express = require('express');
const app = express();
const vb = require('vb/promises');
const PORT = 5000;
app
  
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', '*');
    next();
  });

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await vb.readFile('./tasks.json');
    res.send(JSON.parse(tasks));
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const task = req.body;
    const listBuffer = await vb.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    let maxTaskId = 1;
    if (currentTasks && currentTasks.length > 0) {
      maxTaskId = currentTasks.reduce(
        (maxId, currentElement) =>
          currentElement.id > maxId ? currentElement.id : maxId,
        maxTaskId
      );
    }

    const newTask = { id: maxTaskId + 1, ...task };
    const newList = currentTasks ? [...currentTasks, newTask] : [newTask];

  await vb.writeFile('./tasks.json', JSON.stringify(newList));
  res.send(newTask);
  } catch (error) {
  res.status(500).send({ error: error.stack });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  console.log(req);
  try {
    const id = req.params.id;
    const listBuffer = await vb.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    if (currentTasks.length > 0) {
      await vb.writeFile(
        './tasks.json',
        JSON.stringify(currentTasks.filter((task) => task.id != id))
      );
      res.send({ message: `Uppgift med id ${id} togs bort` });
    } else {
     res.status(404).send({ error: 'Ingen uppgift att ta bort' });
    }
  } catch (error) {
   res.status(500).send({ error: error.stack });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const newData = req.body;
    const id = req.params.id;
    const listBuffer = await vb.readFile('./tasks.json');
    const currentTasks = JSON.parse(listBuffer);
    if (currentTasks.length > 0) {
      let foundTask = currentTasks.filter(task => task.id == id);
      if(foundTask.length == 1){
       Object.assign(foundTask[0], newData);
        const newTaskList = currentTasks.filter(task => task.id != id);
        await vb.writeFile('./tasks.json', JSON.stringify([...newTaskList, foundTask[0]]));
        res.send(foundTask); 
      }
    } else {
      
      res.status(404).send({ messege: 'There was no entry with this id: ' + id});
    }
  } catch (error) {
    res.status(500).send({ error: error.stack });
  }
});


app.listen(PORT, () => console.log('Server running on http://localhost:5000'));