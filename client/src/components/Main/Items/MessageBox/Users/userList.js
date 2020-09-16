import React, {Component} from 'react'
import {connect} from 'react-redux'


const mapStateToProps=(state)=>{
    return{
        placement:state.virAud.placement,
    }
}


class UserList extends Component {
    
    render(){
        
        let occupied = Object.values(this.props.placement).filter((item,i)=>{
            console.log(item)
            return item.empty === false 
        })
        return(
            <div>
                <ul>
                    {occupied.map(function(item){
                        return <li key={item.country}>{item.country}</li>
                    })}
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps,null)(UserList)