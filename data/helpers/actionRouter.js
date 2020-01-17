const express = require('express');

const Action = require('./actionModel');
const Project = require('./projectModel');

const router = express.Router();

//POST ACTIONS



// GET ACTIONS

router.get('/', validateActionId, (req,res)=> {
    const id = req.params.id;
    Action.get(id)
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(error => {
        res.status(400).json({
            error: "Unable to get actions"
        })
    })
})

//POST Action

router.post('/:id', validateProjectId, validateAction,  (req,res)=>{
  
})



// Update Action:

router.put('/:id', validateActionId, validateAction, (req,res)=>{
  
})

//DELETE action: 

router.delete('/:id', validateActionId, (req,res)=>{
    const id = req.params.id;

    Action.remove(id)
    .then(deleted => {
        if(deleted){
          console.log('User deleted:', deleted)
          res.status(200).json(deleted);
        } else {
          res.status(404).json({
            error: "action not found"
          })
        }
      })
      .catch( error => {
         console.log(error);
         res.status(500).json({
           error: "The action could not be deleted"
         })
      })
})

function validateProjectId(req,res,next){
    const id = req.params.id;
   Project.get(id)
    .then(verify=>{
        if(verify){
            req.user=id;
            next();
        }
        else {
            res.status(404).json({
                error: "ID not found. Brought to you by ---- Middleware"
            })
        }
    })
}


router.use(validateProjectId);

function validateActionId(req,res,next){
    const id = req.params.id;
   Action.get(id)
    .then(verify=>{
        if(verify){
            req.user=id;
            next();
        }
        else {
            res.status(404).json({
                error: "ID not found. Brought to you by ---- Middleware"
            })
        }
    })
}

router.use(validateActionId);

function validateAction(req, res, next) {
    // do your magic!
    const action = req.body;
    if(action){
 
      if(action.project_id && action.description && action.notes && typeof action.project_id == "number" && typeof action.description == "string" && typeof action.notes == "string"){
  
        Action.insert(action)
        .then( data => {
          console.log('Post validated by MW')
          res.status(201).json(data);
          next();
        })
        .catch( error => {
          res.status(500).json({
            error: "Error adding post ----- ValidatePost MW"
          })
        })
      } else {
        res.status(400).json({
          error: "Missing Required Text Field --- ValidatePost MW"
        })
      }
  
    } else {
      res.status(400).json({
        error: "Missing Post Data --- ValidatePost MW"
      })
    }
  }
  
  router.use(validateAction);


module.exports = router;