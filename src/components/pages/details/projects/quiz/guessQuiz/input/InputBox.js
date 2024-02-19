import { useMemo, useState } from "react";
import unidecode from "unidecode";

const InputBox = ({ options, answer, handleScore, isFreeText, data, hasAnswered }) => {
  const [guess, setGuess] = useState('');

  const handleClick = e => {
    const newGuess = e.target.value;
    setGuess(newGuess);
    handleScore(newGuess == answer);
  };

  const getClassName = option => {
    let base = 'btn me-2 ';
    if (!guess || !hasAnswered) {
      base += 'btn-info';
    } else if (option == answer) {
      base += 'btn-success';
    } else if (option == guess) {
      base += 'btn-danger';
    } else {
      base += 'btn-info';
    }
    return base;
  }

  const normalise = text => {
    const fixed = unidecode(text)
      .replace(/\s+/g, '')
      .toLowerCase()
      .replace(/\(.*?\)/gi, '')
      .replace(/[^0-9a-z]/gi, '')
    return fixed;
  };

  const removeBrackets = text => text.replace(/\(.*?\)/gi, '');

  const normalisedData = useMemo(() => {
    const toReturn = {};
    for (const [k, v] of Object.entries(data)) {
      const normalisedKey = normalise(k);
      if (!(normalisedKey in toReturn)) {
        toReturn[normalisedKey] = new Set();
      }
      toReturn[normalisedKey].add(v);
    }
    return toReturn;
  });

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      const guess = normalise(e.target.value);
      if (!guess) {
        return;
      }
      setGuess(guess);
      if (normalisedData[guess]) {
        console.log(normalisedData[guess]);
        console.log(data[answer]);
        handleScore(normalisedData[guess].has(data[answer]));
      } else {
        handleScore(normalise(guess) === normalise(answer));
      }
      e.target.value = '';
    }
  }

  return <section className='justify-content-start'>
    <div className='my-2'>
      {isFreeText
        ? <input type='text' onKeyDown={onKeyDown} placeholder='Enter answer here'/>
        : options.map(option =>
          <button
            className={getClassName(option)}
            onClick={handleClick}
            value={option}
            key={option}
          >
            {removeBrackets(option)}
          </button>
        )
      }
    </div>
  </section>
};

export default InputBox;