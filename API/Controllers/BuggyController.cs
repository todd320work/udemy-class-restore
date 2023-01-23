using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("notfound")]
        public ActionResult getNotFound()
        {
            return NotFound();
        }
        [HttpGet("bad-request")]
        public ActionResult getBadReq()
        {
            return BadRequest(new ProblemDetails{Title = "This was bad bad from ReStore!"});
        }
        [HttpGet("validation-err")]
        public ActionResult getValidationErr()
        {
            ModelState.AddModelError("Problem1", "this is the first err");
            ModelState.AddModelError("prob2", "second problem here");
            return ValidationProblem();
        }
        [HttpGet("server-error")]
        public ActionResult getServerError()
        {
            throw new Exception("This is a server error from ReStore!");
        }
        [HttpGet("unauthorized")]
        public ActionResult GetUnauth()
        {
            return Unauthorized();
        }
    }
}