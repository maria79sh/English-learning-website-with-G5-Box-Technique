import logging
from typing import Annotated
from fastapi import HTTPException, Depends
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute, APIRouter
from gateways.instances import mongo_conn, redis_conn
from app.apis.v1 import schemas
from utils.security import login_plugin, register_plugin, get_current_user
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from utils.dependency import oauth2_scheme
from utils.functions import (init_user, next_question_template,
                             update_user_question_path_id, check_question_template,
                             check_quiz_template)

from app.apis.v1.schemas import FlashCardInput

import settings



logger = logging.getLogger('app')
appuser_router = APIRouter(
    tags=['Learning English']
)
auth_router = APIRouter(
    tags=['Auth']
)


@auth_router.post("/register")
async def register(user: schemas.UserRegister):
    if user.password != user.confirm_password:
        error_message = {"message": "confirm password not matched with password"}
        return JSONResponse(status_code=403, content=error_message)
    user_exist = mongo_conn.get_user(user.username)
    if user_exist:
        username = user_exist['username']
        error_message = {"message": f"User {username} already exist"}
        return JSONResponse(status_code=403, content=error_message)
    avatars = mongo_conn.get_avatars()
    if user.avatar not in avatars:
        error_message = {"message": "avatar not exist"}
        return JSONResponse(status_code=404, content=error_message)
    user_dict = register_plugin(user)
    user_dict = init_user(user_dict)
    user_id = mongo_conn.create_user(user_dict)
    return {"message": f"User {user_id} registered successfully"}


@auth_router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_db = mongo_conn.get_user(form_data.username)
    access_token =login_plugin(user_db, form_data.username, form_data.password)
    return {"access_token": access_token, "token_type": "bearer"}



@auth_router.put("/edit_profile")
async def edit_profile(user: schemas.UserProfile, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    if user.password != user.confirm_password:
        error_message = {"message": "confirm password not matched with password"}
        return JSONResponse(status_code=403, content=error_message)
    user_exist = mongo_conn.get_user(username)
    if not user_exist:
        error_message = {"message": "User not exist"}
        return JSONResponse(status_code=404, content=error_message)
    avatars = mongo_conn.get_avatars()
    if user.avatar not in avatars:
        error_message = {"message": "avatar not exist"}
        return JSONResponse(status_code=404, content=error_message)
    user_dict = register_plugin(user)
    user_id = mongo_conn.update_user_info(username, "set", user_dict)
    return {"message": f"User {user_id} updated successfully"}


@auth_router.get("/get_avatars")
async def get_avatars():
    avatars = mongo_conn.get_avatars()
    return avatars


@auth_router.get("/current_user")
async def get_secure_user(token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    user_db = mongo_conn.get_user(username)
    if user_db is None:
        raise HTTPException(status_code=401, detail="User not found")
    return schemas.UserInfo(**user_db)


@appuser_router.get("/get_next_vocab")
async def get_next_vocab(vocab_id: int, oqt: schemas.OpenQuestionType,
                         token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    nid, nquestion = next_question_template(vocab_id, oqt, mongo_conn.get_vocab)
    update_user_question_path_id(settings.VOCAB_COL, nid, username)
    return schemas.Question(**nquestion)


@appuser_router.get("/get_next_vocab_advanced")
async def get_next_vocab_advanced(vocab_id: int, oqt: schemas.OpenQuestionType,
                         token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    nid, nquestion = next_question_template(vocab_id, oqt, mongo_conn.get_vocab_adv)
    update_user_question_path_id(settings.VOCAB_ADVANCED_COL, nid, username)
    return schemas.Question(**nquestion)


@appuser_router.get("/get_next_writing")
async def get_next_writing(writing_id: int, oqt: schemas.OpenQuestionType,
                            token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    nid, nquestion = next_question_template(writing_id, oqt, mongo_conn.get_writing)
    update_user_question_path_id(settings.WRITING_COL, nid, username)
    return schemas.Question(**nquestion)


@appuser_router.get("/get_next_spelling")
async def get_next_spelling(spelling_id: int, oqt: schemas.OpenQuestionType,
                            token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    nid, nquestion = next_question_template(spelling_id, oqt, mongo_conn.get_spelling)
    update_user_question_path_id(settings.SPELLING_COL, nid, username)
    return schemas.Question(**nquestion)
    

@appuser_router.get("/get_next_listening")
async def get_next_listening(listening_id: int, oqt: schemas.OpenQuestionType,
                              token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    nid, nquestion = next_question_template(listening_id, oqt, mongo_conn.get_listening)
    update_user_question_path_id(settings.LISTENING_COL, nid, username)
    return schemas.ListeningQuestion(**nquestion)


@appuser_router.get("/get_next_grammar")
async def get_next_grammar(grammar_id: int, oqt: schemas.OpenQuestionType,
                            token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    nid, nquestion = next_question_template(grammar_id, oqt, mongo_conn.get_grammar)
    update_user_question_path_id(settings.GRAMMAR_COL, nid, username)
    return schemas.Question(**nquestion)


@appuser_router.get("/get_next_grammar_advanced")
async def get_next_grammar_advanced(grammar_id: int, oqt: schemas.OpenQuestionType,
                            token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    nid, nquestion = next_question_template(grammar_id, oqt, mongo_conn.get_grammar_adv)
    update_user_question_path_id(settings.GRAMMAR_COL, nid, username)
    return schemas.Question(**nquestion)


@appuser_router.get("/get_quiz")
async def get_quiz(cup_id: int, token: str = Depends(oauth2_scheme)):
    quiz = mongo_conn.get_quiz(cup_id)
    return schemas.Quiz(**quiz)


@appuser_router.post("/check_vocab_question")
async def check_vocab_question(sub_question: schemas.SubmitQuestion, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    vocab = mongo_conn.get_vocab(sub_question.qid)
    correct_answer = vocab['correct_answer']
    print(f"Received data: {sub_question}")
    return check_question_template(settings.VOCAB_COL, correct_answer, sub_question,
                             username)

@appuser_router.post("/check_vocab_question_Advanced")
async def check_vocab_question_advanced(sub_question: schemas.SubmitQuestion, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    vocab = mongo_conn.get_vocab_adv(sub_question.qid)
    correct_answer = vocab['correct_answer']
    print(f"Received data: {sub_question}")
    return check_question_template(settings.VOCAB_ADVANCED_COL, correct_answer, sub_question,
                             username)

@appuser_router.post("/check_writing_question")
async def check_writing_question(sub_question: schemas.SubmitQuestion, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    writing = mongo_conn.get_writing(sub_question.qid)
    correct_answer = writing['correct_answer']
    return check_question_template(settings.WRITING_COL, correct_answer, sub_question,
                             username)


@appuser_router.post("/check_listening_question")
async def check_listening_question(sub_question: schemas.SubmitQuestion, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    listening = mongo_conn.get_listening(sub_question.qid)
    correct_answer = listening['correct_answer']
    return check_question_template(settings.LISTENING_COL, correct_answer, sub_question,
                             username)


@appuser_router.post("/check_spelling_question")
async def check_spelling_question(sub_question: schemas.SubmitQuestion, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    spelling = mongo_conn.get_spelling(sub_question.qid)
    correct_answer = spelling['correct_answer']
    return check_question_template(settings.SPELLING_COL, correct_answer, sub_question,
                             username)


@appuser_router.post("/check_grammar_question")
async def check_grammar_question(sub_question: schemas.SubmitQuestion, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    grammar = mongo_conn.get_grammar(sub_question.qid)
    correct_answer = grammar['correct_answer']
    return check_question_template(settings.GRAMMAR_COL, correct_answer, sub_question,
                             username)


@appuser_router.post("/check_grammar_question_advanced")
async def check_grammar_question_advanced(sub_question: schemas.SubmitQuestion, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    grammar = mongo_conn.get_grammar_adv(sub_question.qid)
    correct_answer = grammar['correct_answer']
    return check_question_template(settings.GRAMMAR_ADVANCED_COL, correct_answer, sub_question,
                             username)


@appuser_router.post("/check_quiz")
async def check_quiz(quiz_input: schemas.QuizInput, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    quiz = mongo_conn.get_quiz(quiz_input.qid)
    quiz_items = quiz['quiz_items']
    return check_quiz_template(quiz_items, quiz_input,
                             username)

@appuser_router.post("/add_flashcards")
async def add_flashcard(vocab_input: FlashCardInput, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    vocab_data = vocab_input.dict()
    vocab_data["_id"] = vocab_data["question"]  # Setting _id to word to match your schema
    mongo_conn.add_flashcard(vocab_data)  # Ensure add_vocab method exists in mongo_conn
    return {"message": "Word submitted successfully"}


@appuser_router.get("/get_box_words")
async def get_box_words(schedule_key: int, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    words = redis_conn.get_words(schedule_key, username)
    return words

@appuser_router.post("/set_box_word")
async def set_box_word(sub_boxwords: schemas.SubmitBoxWords, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    vocab = mongo_conn.get_flashcard(sub_boxwords.word)
    if vocab:
        redis_conn.set_word_with_expire(sub_boxwords.schedule_key, username, sub_boxwords.word)
        return {"message": f"words submitted successfully"}
    return {"message": f"word not exist"}


@appuser_router.post("/set_flashCard_word")
async def set_box_word(sub_boxwords: schemas.SubmitBoxWords, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    vocab = mongo_conn.get_flashcard(sub_boxwords.word)
    if vocab:
        redis_conn.set_word_with_expire(sub_boxwords.schedule_key, username, sub_boxwords.word, sub_boxwords.answer)
        return {"message": f"words submitted successfully"}
    return {"message": f"word not exist"}


@appuser_router.post("/move_box_word")
async def move_box_word(sub_question: schemas.SubmitQuestionBox, token: str = Depends(oauth2_scheme)):
    username = get_current_user(token)
    vocab = mongo_conn.get_flashcard(sub_question.qid)
    correct_answer = vocab['answer']
    if correct_answer == sub_question.user_answer:
        redis_conn.move_word_up(sub_question.box_key, username, vocab['question'])
        return {"message": f"word check true"}
    else:
        redis_conn.move_word_down(sub_question.box_key, username, vocab['question'])
    return {"message": f"word check false" , "correct_answer": correct_answer}



# @appuser_router.get("/get_vocab_by_level_id")
# async def get_vocab_by_level_id(level_id: int, token: str = Depends(oauth2_scheme)):
#     nquestions = mongo_conn.get_vocab_by_level_id(level_id)
#     question_level = {"questions": list(nquestions)}
#     return schemas.Questions(**question_level)


# @appuser_router.get("/get_writing_by_level_id")
# async def get_writing_by_level_id(level_id: int, token: str = Depends(oauth2_scheme)):
#     nquestions = mongo_conn.get_writing_by_level_id(level_id)
#     question_level = {"questions": list(nquestions)}
#     return schemas.Questions(**question_level)


# @appuser_router.get("/get_listening_by_level_id")
# async def get_listening_by_level_id(level_id: int, token: str = Depends(oauth2_scheme)):
#     nquestions = mongo_conn.get_listening_by_level_id(level_id)
#     question_level = {"questions": list(nquestions)}
#     return schemas.Questions(**question_level)

# @appuser_router.get("/get_spelling_by_level_id")
# async def get_spelling_by_level_id(level_id: int, token: str = Depends(oauth2_scheme)):
#     nquestions = mongo_conn.get_spelling_by_level_id(level_id)
#     question_level = {"questions": list(nquestions)}
#     return schemas.Questions(**question_level)

# @appuser_router.get("/get_grammar_by_level_id")
# async def get_grammar_by_level_id(level_id: int, token: str = Depends(oauth2_scheme)):
#     nquestions = mongo_conn.get_grammar_by_level_id(level_id)
#     question_level = {"questions": list(nquestions)}
#     return schemas.Questions(**question_level)