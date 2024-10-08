from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
BASE_LOG_DIR = BASE_DIR / 'logs'


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'data': {
            'format': 'DATA:  %(asctime)s | %(message)s'
        },
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(asctime)s %(module)s -> %(message)s'
        },
    },
    'handlers': {
        'app': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_LOG_DIR/'app.log',
            'formatter': 'data'
        },
        'fastapi': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_LOG_DIR / 'fastapi.log',
            'formatter': 'simple'
        }
    },
    'loggers': {
        'app': {
            'handlers': ['app'],
            'level': 'INFO',
            'propagate': False,
        },
        'fastapi': {
            'handlers': ['fastapi'],
            'level': 'INFO',
            'propagate': False,
        }
    }
}

SECRET_KEY = "msh"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
STATIC_WORD_BOX = ["Abandon", "Abroad",
 "Colleague", "Autumn",
 "Astronaut", "Accurate", "Artificial"
 , "Architect", "Adverb", "Hardship" ,
  "Fugitive", "Literacy", "Heir",
  "Logical", "Mourn", "Nest",
  "Miracle", "Motivation", "Neutral",
   "Emission", "narrow"]
MONGODB_URL = "mongodb://localhost:27017/"
DATABASE_NAME = "LearningEnglish"

VOCAB_COL = 'vocab'
VOCAB_ADVANCED_COL = 'vocabAdvanced'
WRITING_COL = 'writing'
WRITING_ADVANCED_COL = 'writingAdvanced'
LISTENING_COL = 'listening'
SPELLING_COL = 'spelling'
GRAMMAR_COL = 'grammar'
GRAMMAR_ADVANCED_COL = 'grammarAdvanced'
SCORE_WEIGHT = 20

HOST = "http://127.0.0.1:8080"
STATIC_DIR = "/static"

EXP_DOC = {1: 86400,
            2: 172800,
            3: 604800}