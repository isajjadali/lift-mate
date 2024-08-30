module.exports = {
    up: (queryInterface) =>
        queryInterface.bulkInsert(
            'configurations',
            [
                {
                    configs:
            '{"meetAndGreet":{"amount":"20","percentage":"10"},"maxMilesSurge":{"maxMiles":"20","amount":"10"},"home":{"contactNumber":"1-(833)-495-7827","coreValue":"Best Value with Reliabilty.","customerSatisfactionDescription":"Reserve a ride for Early Morning Airport Trips with Confidence. In our service category, we lead the market in value proposition.You WILL NOT find a cheaper Airport trransportation service with this level of customer service, reliability and Consistency. Over 10 years of driving experience; Our professional drivers always make sure that you get to the destination on time safely. Unlike other companies, we Always pick up in Fully Black-on-Black and Fully Commercial insured vehicles.","questionare":"Why choose 95 Star?","welcomeDescription":"Safety is our priority, Due to COVID-19, Every Passenger is recommended to wear a mask. All windows will be down (a little bit) while passenger(s) is/are in the vehicle.\\nThanks for your Cooperation and stay safe!!!! The most affordable and reliable Car Service To/From Bwi Airport. Get a \'Free Quote\' in less than a minute.","workingHours":"24/7","serviceWeOfferDescription":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","paymentDescription":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},"messages":{"reservationAlert":"<p>For Non-Airport Quote, <strong>Please Call Us At 1-(833)-495-7827</strong></p>"},"extraStopCharges":{"amount":"10"}}',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),

    down: (queryInterface) =>
        queryInterface.bulkDelete(
            'configurations',
            [
                {
                    configs:
            '{"meetAndGreet":{"amount":"20","percentage":"10"},"maxMilesSurge":{"maxMiles":"20","amount":"10"},"home":{"contactNumber":"1-(833)-495-7827","coreValue":"Best Value with Reliabilty.","customerSatisfactionDescription":"Reserve a ride for Early Morning Airport Trips with Confidence. In our service category, we lead the market in value proposition.You WILL NOT find a cheaper Airport trransportation service with this level of customer service, reliability and Consistency. Over 10 years of driving experience; Our professional drivers always make sure that you get to the destination on time safely. Unlike other companies, we Always pick up in Fully Black-on-Black and Fully Commercial insured vehicles.","questionare":"Why choose 95 Star?","welcomeDescription":"Safety is our priority, Due to COVID-19, Every Passenger is recommended to wear a mask. All windows will be down (a little bit) while passenger(s) is/are in the vehicle.\\nThanks for your Cooperation and stay safe!!!! The most affordable and reliable Car Service To/From Bwi Airport. Get a \'Free Quote\' in less than a minute.","workingHours":"24/7","serviceWeOfferDescription":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.","paymentDescription":"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."},"messages":{"reservationAlert":"<p>For Non-Airport Quote, <strong>Please Call Us At 1-(833)-495-7827</strong></p>"},"extraStopCharges":{"amount":"10"}}',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ],
            {}
        ),
};
