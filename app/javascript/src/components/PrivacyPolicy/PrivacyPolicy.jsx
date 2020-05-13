import React from 'react';

export default function PrivacyPolicy() {

        return (

                <div data-testid="privacy_link" className="row justify-content-center"  style={{cursor: 'pointer'}}>
                        
                        <p data-testid="privacy_text" 
                         onClick={()=>window.open('https://docs.google.com/document/d/1d0zK4uKZESQNP4iqVDmXa3xBp5vcuR1KmbSzl-_kqPM/edit?usp=sharing','_blank')}style={{ fontSize: 14 }}>
                                 <u><strong>Privacy and Terms of Service</strong></u>
                        </p>
                </div>



        );

}
