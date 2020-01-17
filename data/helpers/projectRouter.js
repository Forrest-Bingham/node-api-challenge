const express = require('express');

const Project = require('./projectModel.js');
const Action = require('./actionModel.js');

const router = express.Router();


//GET PROJECTS
router.get('/:id', validateId, (req,res)=> {
    const id = req.params.id;
    Project.get(id)
    .then(actions => {
       if(actions){
        res.status(200).json(actions);
       } else {
           res.status(404).json({
               error: "Unable to find project with that ID"
           })
       }
    })
    .catch(error => {
        res.status(400).json({
            error: "Unable to get Projects"
        })
    })
})

//Get Actions: 

router.get('/:id/actions', validateId, (req,res)=> {
    const id = req.params.id;
    
    Project.get(id)
    .then(actions => {
       if(actions){
        res.status(200).json(actions.actions);
       } else {
           res.status(404).json({
               error: "Unable to find project with that ID"
           })
       }
    })
    .catch(error => {
        res.status(400).json({
            error: "Unable to get Projects"
        })
    })
})

//POST PROJECTS

router.post('/', (req,res)=>{
    const pData = req.body;

    if(pData.name && pData.description){
        if(typeof pData.name == "string" && typeof pData.name =="string"){
            Project.insert(pData)
            .then( project => {
                res.status(201).json(project)
            })
            .catch(error => {
                res.status(500).json({
                    error: "Unable to add project"
                })
            })
        }
    } else {
        res.status(400).json({
            error: "Please enter a name and description for this new project"
        })
    }
})

//Post action for a project

// router.post('/:id/actions')

//PUT project

router.put('/:id', validateId, (req,res)=> {
    const id = req.params.id;
    const data = req.body;

    Project.update(id, data)
    .then(update => {
        if(update){
            if(data.name && data.description && typeof data.name == "string" && typeof data.description =="string"){
                res.status(200).json(update);
            } else {
                res.status(400).json({
                    error: "Please enter a new name or description"
                })
            }
        } 
        
    })
    .catch( error => {
        res.status(500).json({
            error: "Could not update this Project."
        })
    })
})

// DELETE PROJECT 

router.delete('/:id', validateId, (req,res)=>{
    const id = req.params.id;
    Project.remove(id)
    .then( deleted => {
        res.status(200).json(deleted);
    })
    .catch( error => {
        res.status(500).json({
            error: "Unable to delete this Project."
        })
    })
})

//Check ID Middleware;

function validateId(req,res,next){
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

router.use(validateId);



module.exports = router;