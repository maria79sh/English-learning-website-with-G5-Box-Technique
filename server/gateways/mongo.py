from pymongo import MongoClient, DESCENDING
import settings


class MongoConnection:
    def __init__(self, db_name):
        client = MongoClient(settings.MONGODB_URL)
        self.db = client[db_name]

    def get_flashcard(self, qid):
        flashcard = self.db.flashcard.find_one({"_id": qid})
        return flashcard
        
    def get_unique_id(self, collection):
        latest_item = collection.find_one(sort=[("_id", -1)])
        latest_id = latest_item["_id"] if latest_item else 0
        return latest_id + 1
    
    def create_user(self, user_dict):
        inserted_id = self.db.user.insert_one(user_dict).inserted_id
        return inserted_id

    def add_flashcard(self, vocab_data):
        result = self.db.flashcard.insert_one(vocab_data)
        return result.inserted_id

    def get_user(self, username):
        user = self.db.user.find_one({"username": username})
        return user 
    
    def update_user_info(self, username, opt, updated_info):
        doc_operation = {f"${opt}": updated_info}
        self.db.user.update_one({"username": username}, doc_operation)

    def create_user_action(self, action):
        inserted_id = self.db.user_actions.insert_one(action).inserted_id
        return inserted_id 
    
    def get_user_action(self, _id):
        user_actions = self.db.user_actions.find_one({"_id": _id})
        return user_actions
    
    def update_user_action(self, _id, updated_data):
        self.db.user_actions.update_one({"_id": _id}, {"$set": updated_data})

    def get_vocab(self, qid):
        vocab = self.db.vocab.find_one({"_id": qid})
        return vocab

    def get_vocab_adv(self, qid):
        vocab = self.db.vocab.find_one({"_id": qid})
        return vocab

    def get_quiz(self, qid):
        quiz = self.db.quiz.find_one({"_id": qid})
        return quiz
    
    def get_writing(self, qid):
        writing = self.db.writing.find_one({"_id": qid})
        return writing

    def get_spelling(self, qid):
        spelling = self.db.spelling.find_one({"_id": qid})
        return spelling

    def get_grammar(self, qid):
        grammar = self.db.grammar.find_one({"_id": qid})
        return grammar

    def get_grammar_adv(self, qid):
        grammar = self.db.grammarAdvanced.find_one({"_id": qid})
        return grammar

    def get_listening(self, qid):
        listening = self.db.listening.find_one({"_id": qid})
        return listening

    def get_avatars(self):
        avatars = self.db.avatars.find({})[0]['avatars']
        return avatars

