import { Trans } from '@lingui/react';
import type { CityInfo, CityCode } from '../types';

// 城市数据配置
export const cityData: Record<CityCode, CityInfo> = {
  sydney: {
    code: 'sydney',
    name: <Trans id="cities.sydney.name" message="Sydney" />,
    country: 'Australia',
    heroImage:
      'https://images.unsplash.com/photo-1624138784614-87fd1b6528f8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.sydney.description"
        message="Australia's vibrant harbor city with iconic landmarks"
      />
    ),
    tagline: <Trans id="cities.sydney.tagline" message="Where dreams meet the harbor" />,
  },
  melbourne: {
    code: 'melbourne',
    name: <Trans id="cities.melbourne.name" message="Melbourne" />,
    country: 'Australia',
    heroImage:
      'https://images.unsplash.com/photo-1545044846-351ba102b6d5?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.melbourne.description"
        message="Australia's cultural capital with world-class coffee and arts"
      />
    ),
    tagline: (
      <Trans id="cities.melbourne.tagline" message="Culture, coffee, and endless possibilities" />
    ),
  },
  brisbane: {
    code: 'brisbane',
    name: <Trans id="cities.brisbane.name" message="Brisbane" />,
    country: 'Australia',
    heroImage:
      'https://images.unsplash.com/photo-1548661625-a30d197ce439?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.brisbane.description"
        message="Sunny Queensland capital with river city charm"
      />
    ),
    tagline: <Trans id="cities.brisbane.tagline" message="Sunshine and river city lifestyle" />,
  },
  perth: {
    code: 'perth',
    name: <Trans id="cities.perth.name" message="Perth" />,
    country: 'Australia',
    heroImage:
      'https://images.unsplash.com/photo-1580014942344-ce423d2b885a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.perth.description"
        message="Western Australia's coastal gem with pristine beaches"
      />
    ),
    tagline: <Trans id="cities.perth.tagline" message="Where the west coast comes alive" />,
  },
  adelaide: {
    code: 'adelaide',
    name: <Trans id="cities.adelaide.name" message="Adelaide" />,
    country: 'Australia',
    heroImage:
      'https://images.unsplash.com/photo-1702252212983-db7e428cc3cf?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.adelaide.description"
        message="Festival city surrounded by world-renowned wine regions"
      />
    ),
    tagline: <Trans id="cities.adelaide.tagline" message="Festivals, wine, and good living" />,
  },
  goldcoast: {
    code: 'goldcoast',
    name: <Trans id="cities.goldcoast.name" message="Gold Coast" />,
    country: 'Australia',
    heroImage:
      'https://images.unsplash.com/photo-1591701729564-3b5325d5a4bd?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.goldcoast.description"
        message="Coastal paradise with world-class beaches and entertainment"
      />
    ),
    tagline: <Trans id="cities.goldcoast.tagline" message="Where surf meets sky" />,
  },
  toronto: {
    code: 'toronto',
    name: <Trans id="cities.toronto.name" message="Toronto" />,
    country: 'Canada',
    heroImage:
      'https://images.unsplash.com/photo-1515983206477-c0df29b37a27?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.toronto.description"
        message="Canada's largest city, a vibrant multicultural metropolis"
      />
    ),
    tagline: <Trans id="cities.toronto.tagline" message="Where diversity meets opportunity" />,
  },
  vancouver: {
    code: 'vancouver',
    name: <Trans id="cities.vancouver.name" message="Vancouver" />,
    country: 'Canada',
    heroImage:
      'https://images.unsplash.com/photo-1559511260-66a654ae982a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.vancouver.description"
        message="Pacific coastal city where mountains meet the sea"
      />
    ),
    tagline: <Trans id="cities.vancouver.tagline" message="Where mountains embrace the ocean" />,
  },
  montreal: {
    code: 'montreal',
    name: <Trans id="cities.montreal.name" message="Montreal" />,
    country: 'Canada',
    heroImage:
      'https://images.unsplash.com/photo-1559682468-a6a29e7d9517?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9udHJlYWwlMjBza3lsaW5lfGVufDB8fDB8fHww',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.montreal.description"
        message="European charm in North America with rich French culture"
      />
    ),
    tagline: (
      <Trans id="cities.montreal.tagline" message="European elegance, North American spirit" />
    ),
  },
  calgary: {
    code: 'calgary',
    name: <Trans id="cities.calgary.name" message="Calgary" />,
    country: 'Canada',
    heroImage:
      'https://images.unsplash.com/photo-1597288253816-54ea162cdf0d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.calgary.description"
        message="Gateway to the Canadian Rockies with western hospitality"
      />
    ),
    tagline: <Trans id="cities.calgary.tagline" message="Where prairies meet the mountains" />,
  },
  ottawa: {
    code: 'ottawa',
    name: <Trans id="cities.ottawa.name" message="Ottawa" />,
    country: 'Canada',
    heroImage:
      'https://images.unsplash.com/photo-1613059713171-13462f7fff92?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.ottawa.description"
        message="Canada's capital with historic charm and governmental elegance"
      />
    ),
    tagline: <Trans id="cities.ottawa.tagline" message="Capital beauty, timeless tradition" />,
  },
  // Chinese Cities
  beijing: {
    code: 'beijing',
    name: <Trans id="cities.beijing.name" message="Beijing" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1708224001647-2b1a00ab296f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.beijing.description"
        message="China's capital with ancient history and modern innovation"
      />
    ),
    tagline: <Trans id="cities.beijing.tagline" message="Where tradition meets the future" />,
  },
  // TODO(human): Help decide best approach for remaining Chinese cities
  // Beijing current: photo-1518169059853-c2987b5a5e75
  // Guangzhou current: photo-1589018416907-6d320b722c62
  // Need landmark-specific images for visual recognition
  shanghai: {
    code: 'shanghai',
    name: <Trans id="cities.shanghai.name" message="Shanghai" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1523281855495-b46cf55b1e7e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.shanghai.description"
        message="Global financial hub with stunning skyline and rich culture"
      />
    ),
    tagline: <Trans id="cities.shanghai.tagline" message="The Pearl of the Orient" />,
  },
  guangzhou: {
    code: 'guangzhou',
    name: <Trans id="cities.guangzhou.name" message="Guangzhou" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1633435402730-519c295b3218?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.guangzhou.description"
        message="Southern China's commercial center with Cantonese heritage"
      />
    ),
    tagline: <Trans id="cities.guangzhou.tagline" message="Gateway to South China" />,
  },
  shenzhen: {
    code: 'shenzhen',
    name: <Trans id="cities.shenzhen.name" message="Shenzhen" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1656658577043-025a85b3f0a9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.shenzhen.description"
        message="China's Silicon Valley with cutting-edge technology"
      />
    ),
    tagline: <Trans id="cities.shenzhen.tagline" message="Innovation at the speed of light" />,
  },
  hongkong: {
    code: 'hongkong',
    name: <Trans id="cities.hongkong.name" message="Hong Kong" />,
    country: 'Hong Kong',
    heroImage:
      'https://images.unsplash.com/photo-1690070767302-86a0f719a36f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.hongkong.description"
        message="International finance center where East meets West"
      />
    ),
    tagline: <Trans id="cities.hongkong.tagline" message="Asia's World City" />,
  },
  chengdu: {
    code: 'chengdu',
    name: <Trans id="cities.chengdu.name" message="Chengdu" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1558963253-97f95e6c45e8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.chengdu.description"
        message="Sichuan's cultural heart with spicy cuisine and pandas"
      />
    ),
    tagline: <Trans id="cities.chengdu.tagline" message="Land of abundance and leisure" />,
  },
  chongqing: {
    code: 'chongqing',
    name: <Trans id="cities.chongqing.name" message="Chongqing" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1573295918531-1b7468569fd1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.chongqing.description"
        message="Mountain city with hot pot culture and Yangtze River views"
      />
    ),
    tagline: <Trans id="cities.chongqing.tagline" message="The mountain metropolis" />,
  },
  xian: {
    code: 'xian',
    name: <Trans id="cities.xian.name" message="Xi'an" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1591709976757-94efbfd3b01e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.xian.description"
        message="Ancient capital home to the Terracotta Warriors"
      />
    ),
    tagline: <Trans id="cities.xian.tagline" message="Eternal city of dynasties" />,
  },
  hangzhou: {
    code: 'hangzhou',
    name: <Trans id="cities.hangzhou.name" message="Hangzhou" />,
    country: 'China',
    heroImage:
      'https://images.unsplash.com/photo-1640100385267-4b935d8ef86c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.hangzhou.description"
        message="Paradise on earth with West Lake's serene beauty and tech innovation"
      />
    ),
    tagline: (
      <Trans
        id="cities.hangzhou.tagline"
        message="West Lake poetry meets a thriving digital economy"
      />
    ),
  },
  macau: {
    code: 'macau',
    name: <Trans id="cities.macau.name" message="Macau" />,
    country: 'Macau',
    heroImage:
      'https://images.unsplash.com/photo-1634552952414-a4c7844aa458?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.macau.description"
        message="East meets West in this vibrant gaming and cultural hub"
      />
    ),
    tagline: (
      <Trans id="cities.macau.tagline" message="Where Portuguese charm meets Chinese heritage" />
    ),
  },
  // Japanese Cities
  tokyo: {
    code: 'tokyo',
    name: <Trans id="cities.tokyo.name" message="Tokyo" />,
    country: 'Japan',
    heroImage:
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.tokyo.description"
        message="Japan's vibrant capital blending tradition and modernity"
      />
    ),
    tagline: <Trans id="cities.tokyo.tagline" message="Where ancient meets ultra-modern" />,
  },
  osaka: {
    code: 'osaka',
    name: <Trans id="cities.osaka.name" message="Osaka" />,
    country: 'Japan',
    heroImage:
      'https://images.unsplash.com/photo-1590559899731-a382839e5549?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.osaka.description"
        message="Japan's kitchen with incredible street food and friendly culture"
      />
    ),
    tagline: <Trans id="cities.osaka.tagline" message="The nation's kitchen" />,
  },
  kyoto: {
    code: 'kyoto',
    name: <Trans id="cities.kyoto.name" message="Kyoto" />,
    country: 'Japan',
    heroImage:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.kyoto.description"
        message="Ancient imperial capital with temples and traditional arts"
      />
    ),
    tagline: <Trans id="cities.kyoto.tagline" message="Timeless beauty and tradition" />,
  },
  // Singapore
  singapore: {
    code: 'singapore',
    name: <Trans id="cities.singapore.name" message="Singapore" />,
    country: 'Singapore',
    heroImage:
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.singapore.description"
        message="Garden city and global hub of Southeast Asia"
      />
    ),
    tagline: <Trans id="cities.singapore.tagline" message="The Lion City" />,
  },
  // US Cities
  newyork: {
    code: 'newyork',
    name: <Trans id="cities.newyork.name" message="New York" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.newyork.description"
        message="The city that never sleeps, melting pot of cultures"
      />
    ),
    tagline: <Trans id="cities.newyork.tagline" message="The Big Apple" />,
  },
  losangeles: {
    code: 'losangeles',
    name: <Trans id="cities.losangeles.name" message="Los Angeles" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1429554429301-1c7d5ae2d42e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.losangeles.description"
        message="City of dreams, entertainment capital of the world"
      />
    ),
    tagline: <Trans id="cities.losangeles.tagline" message="City of Angels" />,
  },
  sanfrancisco: {
    code: 'sanfrancisco',
    name: <Trans id="cities.sanfrancisco.name" message="San Francisco" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1500111709600-7761aa8216c7?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.sanfrancisco.description"
        message="Tech hub with Golden Gate Bridge and diverse neighborhoods"
      />
    ),
    tagline: <Trans id="cities.sanfrancisco.tagline" message="The Golden Gate City" />,
  },
  miami: {
    code: 'miami',
    name: <Trans id="cities.miami.name" message="Miami" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.miami.description"
        message="Tropical paradise with Art Deco charm and Latin culture"
      />
    ),
    tagline: <Trans id="cities.miami.tagline" message="The Magic City" />,
  },
  seattle: {
    code: 'seattle',
    name: <Trans id="cities.seattle.name" message="Seattle" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1438401171849-74ac270044ee?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.seattle.description"
        message="Emerald City with Space Needle and innovative tech culture"
      />
    ),
    tagline: <Trans id="cities.seattle.tagline" message="Where innovation meets nature" />,
  },
  chicago: {
    code: 'chicago',
    name: <Trans id="cities.chicago.name" message="Chicago" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.chicago.description"
        message="Windy City with stunning architecture and deep-dish pizza"
      />
    ),
    tagline: <Trans id="cities.chicago.tagline" message="America's architectural capital" />,
  },
  boston: {
    code: 'boston',
    name: <Trans id="cities.boston.name" message="Boston" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1573524949339-b830334a31ee?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.boston.description"
        message="Historic cradle of liberty with world-class universities"
      />
    ),
    tagline: <Trans id="cities.boston.tagline" message="Where American history comes alive" />,
  },
  washingtondc: {
    code: 'washingtondc',
    name: <Trans id="cities.washingtondc.name" message="Washington DC" />,
    country: 'United States',
    heroImage:
      'https://images.unsplash.com/photo-1581097543550-b3cbe2e6ea6e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.washingtondc.description"
        message="Nation's capital with monuments and political power"
      />
    ),
    tagline: <Trans id="cities.washingtondc.tagline" message="The heart of American democracy" />,
  },
  // European Cities
  london: {
    code: 'london',
    name: <Trans id="cities.london.name" message="London" />,
    country: 'United Kingdom',
    heroImage:
      'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.london.description"
        message="Historic capital with iconic landmarks and global finance"
      />
    ),
    tagline: <Trans id="cities.london.tagline" message="Where history meets modernity" />,
  },
  paris: {
    code: 'paris',
    name: <Trans id="cities.paris.name" message="Paris" />,
    country: 'France',
    heroImage:
      'https://images.unsplash.com/photo-1524396309943-e03f5249f002?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.paris.description"
        message="City of Light with art, culture, and culinary excellence"
      />
    ),
    tagline: <Trans id="cities.paris.tagline" message="L'art de vivre at its finest" />,
  },
  berlin: {
    code: 'berlin',
    name: <Trans id="cities.berlin.name" message="Berlin" />,
    country: 'Germany',
    heroImage:
      'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.berlin.description"
        message="Dynamic capital with rich history and vibrant cultural scene"
      />
    ),
    tagline: <Trans id="cities.berlin.tagline" message="Unity, creativity, and freedom" />,
  },
  amsterdam: {
    code: 'amsterdam',
    name: <Trans id="cities.amsterdam.name" message="Amsterdam" />,
    country: 'Netherlands',
    heroImage:
      'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.amsterdam.description"
        message="Venice of the North with canals, culture, and liberal spirit"
      />
    ),
    tagline: <Trans id="cities.amsterdam.tagline" message="Canals, culture, and innovation" />,
  },
  dublin: {
    code: 'dublin',
    name: <Trans id="cities.dublin.name" message="Dublin" />,
    country: 'Ireland',
    heroImage:
      'https://images.unsplash.com/photo-1575283757534-1a1999f6f341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.dublin.description"
        message="Literary capital with Georgian architecture and warm hospitality"
      />
    ),
    tagline: (
      <Trans id="cities.dublin.tagline" message="Céad míle fáilte - A hundred thousand welcomes" />
    ),
  },
  edinburgh: {
    code: 'edinburgh',
    name: <Trans id="cities.edinburgh.name" message="Edinburgh" />,
    country: 'United Kingdom',
    heroImage:
      'https://images.unsplash.com/photo-1595599014147-a419c147bdc0?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.edinburgh.description"
        message="Scotland's historic capital with castle and festival culture"
      />
    ),
    tagline: (
      <Trans id="cities.edinburgh.tagline" message="Where Scotland's heart beats strongest" />
    ),
  },
  manchester: {
    code: 'manchester',
    name: <Trans id="cities.manchester.name" message="Manchester" />,
    country: 'United Kingdom',
    heroImage:
      'https://images.unsplash.com/photo-1550945160-35ad09cb2186?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.manchester.description"
        message="Industrial heritage meets modern innovation and football passion"
      />
    ),
    tagline: <Trans id="cities.manchester.tagline" message="The original modern city" />,
  },
  munich: {
    code: 'munich',
    name: <Trans id="cities.munich.name" message="Munich" />,
    country: 'Germany',
    heroImage:
      'https://images.unsplash.com/photo-1577462282244-b58c2816d686?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.munich.description"
        message="Bavarian capital blending traditional charm with modern innovation"
      />
    ),
    tagline: (
      <Trans id="cities.munich.tagline" message="Beer halls, Baroque beauty, and Bavarian warmth" />
    ),
  },
  hamburg: {
    code: 'hamburg',
    name: <Trans id="cities.hamburg.name" message="Hamburg" />,
    country: 'Germany',
    heroImage:
      'https://images.unsplash.com/photo-1598790969148-62630087609e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.hamburg.description"
        message="Maritime gateway with rich port heritage and modern urban culture"
      />
    ),
    tagline: <Trans id="cities.hamburg.tagline" message="Gateway to the world" />,
  },
  // New Zealand
  auckland: {
    code: 'auckland',
    name: <Trans id="cities.auckland.name" message="Auckland" />,
    country: 'New Zealand',
    heroImage:
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.auckland.description"
        message="City of Sails with stunning harbors and outdoor lifestyle"
      />
    ),
    tagline: <Trans id="cities.auckland.tagline" message="Where urban meets nature" />,
  },
  wellington: {
    code: 'wellington',
    name: <Trans id="cities.wellington.name" message="Wellington" />,
    country: 'New Zealand',
    heroImage:
      'https://images.unsplash.com/photo-1641290104373-2a6aa6933603?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.wellington.description"
        message="New Zealand's creative capital with harbor views and cultural vibrancy"
      />
    ),
    tagline: (
      <Trans id="cities.wellington.tagline" message="The coolest little capital in the world" />
    ),
  },
  christchurch: {
    code: 'christchurch',
    name: <Trans id="cities.christchurch.name" message="Christchurch" />,
    country: 'New Zealand',
    heroImage:
      'https://images.unsplash.com/photo-1697946979155-fd4e94f81c90?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.christchurch.description"
        message="Garden City rebuilding with innovation and resilience"
      />
    ),
    tagline: <Trans id="cities.christchurch.tagline" message="Rising stronger from the garden" />,
  },
  // Middle East
  dubai: {
    code: 'dubai',
    name: <Trans id="cities.dubai.name" message="Dubai" />,
    country: 'United Arab Emirates',
    heroImage:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.dubai.description"
        message="Futuristic metropolis with luxury shopping and architectural marvels"
      />
    ),
    tagline: <Trans id="cities.dubai.tagline" message="Where the future begins today" />,
  },
  // Southeast Asia
  bangkok: {
    code: 'bangkok',
    name: <Trans id="cities.bangkok.name" message="Bangkok" />,
    country: 'Thailand',
    heroImage:
      'https://images.unsplash.com/photo-1724396419953-8492b7b52cf2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.bangkok.description"
        message="Vibrant capital with temples, street food, and modern energy"
      />
    ),
    tagline: (
      <Trans
        id="cities.bangkok.tagline"
        message="City of Angels with dazzling temples and night markets"
      />
    ),
  },
  bali: {
    code: 'bali',
    name: <Trans id="cities.bali.name" message="Bali Island" />,
    country: 'Indonesia',
    heroImage:
      'https://images.unsplash.com/photo-1729605411729-b48129161e68?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: (
      <Trans
        id="cities.bali.description"
        message="Indonesia's island province famed for temples, rice terraces, and beaches"
      />
    ),
    tagline: <Trans id="cities.bali.tagline" message="Island of the Gods, your tropical escape" />,
  },
  default: {
    code: 'default',
    name: <Trans id="cities.default.name" message="Explore Cities" />,
    country: 'Global',
    heroImage:
      'https://images.unsplash.com/photo-1542296332-2e4473faf563?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0',
    fallbackImage: '/images/default-city-image.jpg',
    description: <Trans id="cities.default.description" message="Discover your next destination" />,
    tagline: <Trans id="cities.default.tagline" message="Begin your city exploration journey" />,
  },
};

// 默认兜底数据
export const defaultCity: CityInfo = cityData.default;

// 根据城市代码获取城市信息
export const getCityInfo = (cityCode?: CityCode): CityInfo => {
  if (!cityCode || !cityData[cityCode]) {
    return defaultCity;
  }
  return cityData[cityCode];
};

// 获取所有城市列表
export const getAllCities = (): CityInfo[] => {
  return Object.values(cityData);
};

// 获取随机城市信息
export const getRandomCity = (): CityInfo => {
  const cities = getAllCities();
  const randomIndex = Math.floor(Math.random() * cities.length);
  return cities[randomIndex];
};
