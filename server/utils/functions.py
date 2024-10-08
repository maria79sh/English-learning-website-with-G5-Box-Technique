from app.apis.v1 import schemas
from gateways.instances import mongo_conn
import settings


def init_user(user_dict):
    init_app_dict = {"correct_answers": 0, "wrong_answers": 0}
    user_dict['level'] = 0
    user_dict['cup_id'] = 1
    user_dict['vocab'] = init_app_dict
    user_dict['writing'] = init_app_dict
    user_dict['listening'] = init_app_dict
    user_dict['spelling'] = init_app_dict
    user_dict['grammar'] = init_app_dict
    user_dict['score'] = 0
    user_dict['vocab_path_id'] = 0
    user_dict['listening_path_id'] = 0
    user_dict['writing_path_id'] = 0
    user_dict['spelling_path_id'] = 0
    user_dict['grammar_path_id'] = 0

    return user_dict


def update_user_question_path_id(typ, qid, username):
    updated_info = {f'{typ}_path_id': qid}
    mongo_conn.update_user_info(username, "set", updated_info)


def _update_user_level(username):
    user = mongo_conn.get_user(username)
    level = user['score'] // settings.SCORE_WEIGHT
    if user['level'] != level:
        updated_info = {'level': 1}
        mongo_conn.update_user_info(username, "inc", updated_info)


def next_question_template(qid, oqt, get_question):
    if oqt == 'next':
        next_qid = qid + 1
    else:
        next_qid = qid - 1
    next_question = get_question(next_qid)
    if not next_question:
        next_qid = 1
        next_question = get_question(1)
    return next_qid, next_question


def check_question_template(typ, correct_answer, sub_question,
                             username):
      # Create a unique action ID based on question ID, type, and username
    action_id = f'{sub_question.qid}_{typ}_{username}'
    user_action = mongo_conn.get_user_action(action_id)

    action = {'_id': action_id, 'check': None}
    check = True

    # Check if the user's answer matches the correct answer
    if correct_answer == sub_question.user_answer:
        updated_inc = {'score': 5, f'{typ}.correct_answers': 1}
        if not user_action:
            action['check'] = True
            mongo_conn.create_user_action(action)
            mongo_conn.update_user_info(username, "inc", updated_inc)
            _update_user_level(username)
        
        elif user_action['check'] == False: 
            mongo_conn.update_user_action(action_id, {'check': True})
            mongo_conn.update_user_info(username, "inc", updated_inc)
            _update_user_level(username)

    else:
        check = False
        if not user_action:
            action['check'] = False
            mongo_conn.create_user_action(action)
            updated_inc = {f'{typ}.wrong_answers':1}
            mongo_conn.update_user_info(username, "inc", updated_inc)
    
    return {"check": check, "answer": correct_answer}



def check_quiz_template(quiz_items, quiz_input,
                             username):
    action_id = f'{quiz_input.qid}_quiz_{username}'
    user_action = mongo_conn.get_user_action(action_id)

    action = {'_id': action_id, 'check': None}
    check = True

    # Check each quiz item against the user's responses
    for i in range(len(quiz_items)):
        qin = quiz_input.response_items[i]
        qitem = quiz_items[i]['correct_answer']
        if qitem != qin:
            check = False

    if check:
        updated_inc = {'cup_id': 1}
        if not user_action:
            action['check'] = True
            mongo_conn.create_user_action(action)
            mongo_conn.update_user_info(username, "inc", updated_inc)

        elif user_action['check'] == False:
            mongo_conn.update_user_action(action_id, {'check': True})
            mongo_conn.update_user_info(username, "inc", updated_inc)

    else:
        if not user_action:
            action['check'] = False
            mongo_conn.create_user_action(action)

    return {"check": check}