using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace PurchaseOrderManagement.WebApi.Filters
{
    public class ApiResponseWrapperFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            // Do nothing before the action executes
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Result is ObjectResult objectResult)
            {
                var statusCode = objectResult.StatusCode ?? 200;
                bool success = statusCode >= 200 && statusCode < 300;
                context.Result = new ObjectResult(new
                {
                    success,
                    message = success ? "Request successful" : "Request failed",
                    data = objectResult.Value
                })
                {
                    StatusCode = statusCode
                };
            }
            else if (context.Result is StatusCodeResult statusCodeResult)
            {
                bool success = statusCodeResult.StatusCode >= 200 && statusCodeResult.StatusCode < 300;
                context.Result = new ObjectResult(new
                {
                    success,
                    message = success ? "Request successful" : "Request failed"
                })
                {
                    StatusCode = statusCodeResult.StatusCode
                };
            }
        }
    }
}
