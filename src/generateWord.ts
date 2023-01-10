import source from './source.json'
import { WordSetType } from './type'

export const WORD_SET_KEY = 'word-set'

const DRIVER = [
  {
    image: '/1.png',
    name: 'โตโน่',
  },
  {
    image: '/2.png',
    name: 'ตัวตึงเยาวราช',
  },
  {
    image: '/3.png',
    name: 'ตัวตึงระยอง',
  },
  {
    image: '/4.png',
    name: 'ช่างแอร์ในตำนาน',
  },
  {
    image: '/5.png',
    name: 'ทีมแบกโลง',
  },
  {
    image: '/6.png',
    name: 'พี่แซมม',
  },
  {
    image: '/7.png',
    name: 'จุ๊มเหม่งมีอะไร',
  },
  {
    image: '/8.png',
    name: 'ป้าพรชัย',
  },
  {
    image: '/9.png',
    name: 'พรี่เอ๋',
  },
  {
    image: '/10.png',
    name: '...',
  },
]

export const generateWord = (input: Array<string>, numberOfSet: number) => {
  const shuffleInput = input.sort((a, b) => 0.5 - Math.random());
  const shuffleDriver = DRIVER.sort((a, b) => 0.5 - Math.random());
  return shuffleInput.reduce((acc, cur, index) => {
    const modIndex = (index % numberOfSet)
    const currentObjectName = shuffleDriver[modIndex].name
    if (acc[currentObjectName]) {
      return {
        ...acc,
        [currentObjectName]: {
          ...acc[currentObjectName],
          value: [...acc[currentObjectName].value, cur]
        }
      }
    }
    return {
      ...acc,
      [currentObjectName]: {
        name: shuffleDriver[modIndex].name,
        image: shuffleDriver[modIndex].image,
        value: [cur]
      }
    }
  }, ({} as Record<string, WordSetType>))
}

export const setNewWordSet = (numberOfSet: number = 8) => {
  const newWordSet = generateWord(source, numberOfSet)
  localStorage.setItem(WORD_SET_KEY, JSON.stringify(newWordSet))
  return newWordSet
}

export const initialLocalWord = () => {
  const wordString = localStorage.getItem(WORD_SET_KEY)
  if (wordString) {
    return JSON.parse(wordString)
  }
  return setNewWordSet()
}