import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import "../assets/css/InfoBox.module.css";

const InfoBox = ({ message }) => {
    return (
        <div className="info-box-container">
            <Card className="info-box-card">
                <CardContent className="info-box-content">
                    <AlertCircle className="info-box-icon" size={24} />
                    <span className="info-box-text">{message}</span>
                </CardContent>
            </Card>
        </div>
    );
};

export default InfoBox;