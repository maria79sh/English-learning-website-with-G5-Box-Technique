from jose import JWTError, jwt  # JWTError for handling JWT errors, jwt for encoding and decoding JWT tokens
from passlib.context import CryptContext  # CryptContext for password hashing
from datetime import datetime, timedelta  # datetime and timedelta for handling time and date
from fastapi import HTTPException  # HTTPException for raising HTTP exceptions
from app.apis.v1 import schemas  # schemas for accessing the User schema
import settings  # settings for configuration constants like SECRET_KEY and ALGORITHM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def login_plugin(user_db, username, password):
    """
    Authenticates a user and generates an access token.

    : user_db: The user document from the database.
    : username: The username provided by the user.
    : password: The password provided by the user.
    :return: The generated access token.
    """
    if user_db is None or not pwd_context.verify(password, user_db["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": username})
    return access_token

def register_plugin(user: schemas.UserInfo):
    """
    Registers a new user by hashing the password and preparing the user dictionary.

    : user: The user schema containing user details.
    :return: A dictionary with user details, including the hashed password.
    """
    user_dict = user.dict()
    user_dict["hashed_password"] = pwd_context.hash(user.password)
    del user_dict["password"]
    del user_dict["confirm_password"]
    return user_dict

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Creates a JWT access token.

    : data: The data to encode in the token.
    : expires_delta: Optional timedelta for setting the token expiration time.
    :return: The encoded JWT token.
    """
    to_encode = data.copy()

    # Set the token expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(token: str):
    """
    Decodes the JWT token and retrieves the current user's username.

    : token: The JWT token.
    :return: The username of the current user.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

    return username
