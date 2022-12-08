

const express= require("express");
const {CatModel, validteCat} = require("../models/catModel")
const { auth } = require("../middlewares/auth");
const router = express.Router();



router.get("/", async(req,res) => {
  let perPage = Number(req.query.perPage) || 10;
  let page = Number(req.query.page) || 1
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? 1 : -1;

  try{  
    let data = await CatModel
    .find({})
    .limit(perPage)
    .skip((page-1) * perPage )
    .sort({[sort]:reverse})
    res.json(data); 
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

router.get("/search" , async(req,res) => {
  try{  
    let queryS = req.query.s;
    let regQuery = new RegExp(queryS,"i");
    let data = await CatModel
    .find({$or:[{name:regQuery},{info:regQuery}]})
    .limit(20)
    .skip(0)
    res.json(data); 
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})

router.post("/",auth, async(req,res) => {
  let validBody = validteCat(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let cat = new CatModel(req.body);
    cat.user_id = req.tokenData._id
    await cat.save();
    res.status(201).json(cat)
  }
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
})

router.put("/:idEdit",auth,async(req,res) => {
  let validBody = validteCat(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let idEdit = req.params.idEdit;
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})


router.delete("/:idDel",auth,async(req,res) => {
  try{
    let idDel = req.params.idDel;
    let data = await CatModel.deleteOne({_id:idDel})
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json(err)
  }
})


module.exports = router;