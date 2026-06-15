import JobDescription from '../models/JobDescription.js';

export const semanticSearch = async(query)=>{
 return await JobDescription.find({
   $or:[
     {title:{$regex:query,$options:'i'}},
     {description:{$regex:query,$options:'i'}}
   ]
 });
};
