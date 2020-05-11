import React from 'react';
import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {

        return (

                <div data-testid="privacy_link" className="row justify-content-center">

                        <Link to="/privacy_policy">
                                <p style={{ fontSize: 14 }}><strong>Privacy and Terms of Service</strong></p>

                        </Link>

                </div>



        );

}
