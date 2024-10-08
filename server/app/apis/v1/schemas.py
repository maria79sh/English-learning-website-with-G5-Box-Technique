from pydantic import BaseModel
from enum import Enum
from typing import List


class User(BaseModel):
    username: str
    password: str

class UserRegister(User):
    username: str
    password: str
    confirm_password: str
    avatar: str
    phone: str
    name: str


class UserProfile(BaseModel):
    password: str
    confirm_password: str
    avatar: str
    age: int
    name : str

class UserQuestionResult(BaseModel):
    correct_answers: int
    wrong_answers: int
    
class UserInfo(BaseModel):
    username: str
    phone: str
    name : str
    avatar: str
    vocab: UserQuestionResult
    listening: UserQuestionResult
    writing: UserQuestionResult
    spelling: UserQuestionResult
    grammar: UserQuestionResult
    score: int
    level: int
    cup_id: int
    vocab_path_id: int
    listening_path_id: int
    writing_path_id: int
    spelling_path_id: int
    grammar_path_id: int


class UserInDB(User):
    hashed_password: str
    

class Question(BaseModel):
    question: str
    options: list


class Questions(BaseModel):
    questions: List[Question]


class ListeningQuestion(BaseModel):
    audio_path: str
    options: list

class SubmitQuestion(BaseModel):
    qid: int
    user_answer: str

class SubmitFlashCardQuestion(BaseModel):
    qid: str
    user_answer: str


class SubmitQuestionBox(SubmitFlashCardQuestion):
    box_key: int
    

class SubmitBoxWords(BaseModel):
    schedule_key: int
    word: str
    

class OpenQuestionType(str, Enum):
    previous = "previous"
    nextt = "next"


class QuestionQuiz(Question):
    type: str

class Quiz(BaseModel):
    quiz_items: List[QuestionQuiz]

class QuizInput(BaseModel):
    qid: int
    response_items: List[str]

class FlashCardInput(BaseModel):
    question: str
    answer: str