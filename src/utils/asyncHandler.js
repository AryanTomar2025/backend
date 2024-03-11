const asyncHandler = (requestHandler) => {
  //  return a middleware that handles asynchronous functions
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // wrap the request handler
  };
};
export { asyncHandler };




// const asyncHandler=(fn)=>async(req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }