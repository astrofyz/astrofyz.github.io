var config = {
    style: 'mapbox://styles/mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiYXN0cm9meXoiLCJhIjoiY2s1Yno1eXQ4MWdnNTNtbW0wdTB6bTV4cSJ9.JqggCkBwCUvnD7TxAtDnuQ',
    showMarkers: false,
    theme: 'dark',
    alignment: 'left',
    title: 'Twenty years of games',
    subtitle: 'Road to land of 1001 delights',
    byline: 'By astrofyz',
    footer: 'Source: rating',
    chapters: [
        {
            id: '2001',
            title: '2001 Moscow',
            // image: './path/to/image/source.png',
            description: 'кто-то выиграл кто-то проиграл',
            location: {
                center: [37.61981, 55.76042],
                zoom: 8.53,
                pitch: 60,
                bearing: 0
            },
            onChapterEnter: [
                // {
                //     layer: 'layer-name', тут должно быть что-то с арками
                //     opacity: 1
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ]
        },
        {
            id: '2002',
            title: 'Kazan',
            // image: './path/to/image/source.png',
            description: 'выиграл кто-то другой',
            location: {
                center: [49.11417, 55.79172],
                zoom: 11.58,
                pitch: 60,
                bearing: -43.2
            },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};
