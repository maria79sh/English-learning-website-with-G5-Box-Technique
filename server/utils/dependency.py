from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")