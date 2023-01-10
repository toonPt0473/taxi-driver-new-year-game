import source from './source.json'
import { WordSetType } from './type'

export const WORD_SET_KEY = 'word-set'

const DRIVER = [
  {
    image: '/1.png',
    name: 'โตโน่',
    sound: '/1.mp3'
  },
  {
    image: '/2.png',
    name: 'ตัวตึงเยาวราช',
    sound: '/2.mp3'
  },
  {
    image: '/3.png',
    name: 'ตัวตึงระยอง',
    sound: '/3.mp3'
  },
  {
    image: '/4.png',
    name: 'ช่างแอร์ในตำนาน',
    sound: '/4.mp3'
  },
  {
    image: '/5.png',
    name: 'ทีมแบกโลง',
    sound: '/5.mp3'
  },
  {
    image: '/6.png',
    name: 'พี่แซมม',
    sound: '/6.mp3'
  },
  {
    image: '/7.png',
    name: 'จุ๊มเหม่งมีอะไร',
    sound: '/7.mp3'
  },
  {
    image: '/8.png',
    name: 'วัยรุ่นฟันน้ำนมป้ายแดง',
    sound: '/8.mp3'
  },
  {
    image: '/9.png',
    name: 'นุ้งป้อม',
    sound: '/9.mp3'
  },
  {
    image: '/10.png',
    name: '...',
    sound: '/10.mp3'
  },
  {
    image: '/11.png',
    name: 'แฟนพันแท้ลิเวอร์พูล',
    sound: '/11.mp3'
  },
  {
    image: '/12.png',
    name: 'พี่ตั้มเดฟ',
    sound: '/12.mp3'
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
        sound: shuffleDriver[modIndex].sound,
        value: [cur]
      }
    }
  }, ({} as Record<string, WordSetType>))
}

export const setNewWordSet = (numberOfSet: number = 12) => {
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
