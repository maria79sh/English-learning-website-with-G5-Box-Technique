import React, { useEffect } from 'react';

const CalculateVocab = ({ vocabData, vocabCorrect, vocabWrong, setCalculatedVocabResult }) => {
    useEffect(() => {
        const calculatePercent = (data) => {
                var x = Number(vocabCorrect);
                var y = Number(vocabWrong);
                var z = Number(vocabData);
                var finalScoreVocab = (x*3 - y)/ z;
                var finalPercent = finalScoreVocab * 100;
                console.log(finalPercent);
                setCalculatedVocabResult(finalPercent);
        };

        calculatePercent(vocabData);
    }, [vocabData, setCalculatedVocabResult]);

    return null;
};



export default CalculateVocab;
