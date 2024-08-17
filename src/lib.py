import logging
from dataclasses import dataclass
from functools import wraps
from typing import Any, Callable, Coroutine, ParamSpec
from fastapi.responses import JSONResponse
import traceback




@dataclass
class Errors:
    GENERATION_ERROR = JSONResponse({"error": "GENERATION_ERROR"}, 400)
    INTERNAL_ERROR = JSONResponse({"error": "INTERNAL_ERROR"}, 500)

logger = logging.getLogger('uvicorn.error')
P = ParamSpec('P')

def catch_function_error(func: Callable[P, Coroutine[Any, Any, Any]]) -> Callable[P, Coroutine[Any, Any, Any]]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> Any:
        try:
            return func(*args, **kwargs)
        except:
            return None
    return wrapper

def catch_error(func: Callable[P, Coroutine[Any, Any, Any]]) -> Callable[P, Coroutine[Any, Any, Any]]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> Any:
        try:
            return func(*args, **kwargs)
        except:
            logger.error(traceback.format_exc())
            return Errors.INTERNAL_ERROR

    return wrapper

def async_catch_error(func: Callable[P, Coroutine[Any, Any, Any]]) -> Callable[P, Coroutine[Any, Any, Any]]:
    @wraps(func)
    async def wrapper(*args: P.args, **kwargs: P.kwargs) -> Any:
        try:
            return await func(*args, **kwargs)
        except Exception as ex:
            logging.getLogger('uvicorn.error').error(str(ex), exc_info=True, stack_info=True)
            return Errors.INTERNAL_ERROR

    return wrapper