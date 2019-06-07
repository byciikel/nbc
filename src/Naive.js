/* eslint-disable */
// developed by byciikel
import React, { Component } from 'react'
import _ from 'lodash'

export default class Naive extends Component {
  state = {
    listSentiment: [],
    checkSentiment: [],
    checkString: '',
    listUniqueKey: [],
    listAllClassification: [],
    resultClassification: []
  }

  getSentiment = (sentiment, category) => {
    const unique = require('unique-words')
    let arrayCheckSentiment = sentiment.toLowerCase().replace(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/g,"").split(" ") // remove unused character
    let objectSentiment = { category: category.toLowerCase(), sentiment: unique(arrayCheckSentiment), string: sentiment } // remove duplicate words and make it object array
    this.setState({ listSentiment: [...this.state.listSentiment, objectSentiment] })
  }

  checkSentiment = (sentiment) => {
    let arrayCheckSentiment = sentiment.toLowerCase().replace(/[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/g,"").split(" ") // remove unused character
    this.setState({
      checkSentiment: arrayCheckSentiment,
      checkString: sentiment
    })
  }

  getListSentiment = () => {
    const unique = require('unique-words')
    const { listSentiment } = this.state
    let joinedKeyWord = []
    listSentiment.map(object =>
      joinedKeyWord = [...joinedKeyWord, ...object.sentiment]
    )
    let getUniqueKey = unique(joinedKeyWord) // get unique words from list data training
    this.setState({ listUniqueKey: getUniqueKey })
  }

  runClassificator = () => {
    const { listSentiment, checkSentiment, listUniqueKey } = this.state
    let listAllClassification = []

    let pAll = _(listSentiment).groupBy('category').map((object, key) => ({
    	'category': key,
    	'p': object.length / listSentiment.length
    })).value()

	  let wAll = _(listSentiment).groupBy('category').map((object, key) => ({
    	'category': key,
    	'wk': Array.from(object, index => listSentiment.indexOf(index))
    })).value()
    
	  let prob = 0
    pAll.map((key, idx) => {
    	let logCount = []
    	checkSentiment.map((datas, index) => {
    		for (let i = 0; i < wAll[idx].wk.length; i++) {
	    		let words = listSentiment[wAll[idx].wk[i]].sentiment.length
	    		for (let y = 0; y < words; y++) {
	    			if (listSentiment[wAll[idx].wk[i]].sentiment[y] === datas) {
	    				return logCount.push({ key: datas, log: 1 })
	    			} else {
	    				return logCount.push({ key: datas, log: 0 })
	    			}
	    		}
	    	}
    	})

		let arrProb = []
    	checkSentiment.map(datas => {
    		let nk = 0
    		let n = 0
    		
    		logCount.map((count, idx) => {
    			if (count.key === datas && count.log === 1) {
    				return nk = nk + 1
    			}
    		})

 			n = n + nk
 			let buff = ((nk + 1) / (n + listUniqueKey.length))
 			prob = prob + buff
			return arrProb.push({ category: key.category, count: buff })
    	})

		let sumProb = _.sumBy(arrProb, 'count')
    	let endProb = key.p + sumProb
    	return listAllClassification.push({ category: key.category, probability: endProb })
    })
    let resultClassification = _.maxBy(listAllClassification, 'probability')
    this.setState({
    	listAllClassification,
    	resultClassification
    })
  }

  componentDidMount = async () => {
    // list training
    await this.getSentiment('Ruangan Kurang Nyaman', 'Umum')
    await this.getSentiment('jadwal mata kuliah di SIAKAD sering berubah', 'Akademik')
    await this.getSentiment('Dosen Sering Tidur', 'Akademik')
    await this.getSentiment('UKT terlalu mahal, Kalo Bisa diturunkan', 'Keuangan')
    await this.getSentiment('SIAKAD Sering berubah Jadwal Kuliah', 'Kemahasiswaan')
    await this.getSentiment('kurang adanya informasi mengenai lomba', 'Kemahasiswaan')
    await this.getSentiment('Kurangnya sosialisasi tentang beasiswa', 'Kemahasiswaan')
    await this.getSentiment('dana ukm kurang', 'Keuangan')
    await this.getSentiment('tidak ada transparansi penetapan ukt', 'Keuangan')
    await this.getSentiment('jam kuliah kalo bisa Cuma 1 sks', 'Akademik')
    await this.getSentiment('wifi kurang kencang', 'Umum')
    await this.getSentiment('bobolan gang dosen ditutup jam 1800', 'Umum')
    
    await this.checkSentiment('siakad sering berubah dan ukt terlalu mahal') //sentiment
    
    await this.getListSentiment()
    await this.runClassificator()

    // check result
    console.log('List Training: ', this.state.listSentiment)
    console.log('Sentiment: ', this.state.checkString)
    console.log('List Point Classification: ', this.state.listAllClassification)
    console.log('Result Classification: ', this.state.resultClassification)
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}
