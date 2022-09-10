import React, {useMemo} from 'react'

import './style.css'

function Question(props) {

        const buttonElements = props.allAnswers.map(item => 
            <button 
                key={item.id}     
                id={item.id}
                onClick={() => props.checkSelected(item.id, props.question)} 
                className={item.isSelected && (props.mark === false) ? 'question--answer question--answer_checked' : (item.isSelected && (props.mark === true)) ? 'question--answer red' : 'question--answer'}
                style={props.mark ? 
                    {
                        backgroundColor:  item.answer === props.correct_answer.answer && '#94D7A2'
                        
                    } : {}}
                >
                
                {atob(item.answer)}
            </button>)

    
    
    return (
        <div className='question--container'>
            <h3 className='question--setup'>{atob(props.question)}</h3>
            <div className='question--answer_container'>{buttonElements}</div>
            
        </div>
    )
}

export default Question