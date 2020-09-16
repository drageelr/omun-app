import React,{Component} from 'react';
import './Zoom.css'
import {Card, CardBody, CardHeader, CardImg,} from 'reactstrap';


class Zoom extends Component {
    render() { 
        return (  
        <div>
            <Card style={{height:"52vh",overflowY:"hidden"}}>
                <CardHeader>
                    Zoom Screen
                </CardHeader>
                <CardBody>
                        <CardImg className="Image" src="https://i.pcmag.com/imagery/reviews/05fRE6utWAtXmByTrwqgdcU-9.1569481702.fit_scale.size_1028x578.jpg" alt = 'Zoom Image'/>
                </CardBody>
            </Card>
        </div>
        );
    }
}
 
export default Zoom;