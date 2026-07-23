import './Trip.scss'

interface TripProps {
  trip: {
    id: string;
    user_id: string;
    departure_city: string;
    is_public: boolean;
    cities: string[];
    days: number;
    people: number;
    budget: number;
    likes: number;
    created_at: string;
    updated_at: string;
  };
}

function Trip({ trip }: TripProps) {
  return (
    <>
      <div className='trip'>
        <div className='departure'>
          <div className='city'>
            <p className='head'>Departure city</p>
            <p className='place'>
              {trip.departure_city.length > 14
              ? `${trip.departure_city.slice(0, 14)}...`
              : trip.departure_city}
            </p>
          </div>
          <p className={`status ${trip.is_public ? 'public' : 'private'}`}>{trip.is_public ? 'Public' : 'Private'}</p>
        </div>
        <div className='cities'>
          {trip.cities.slice(0, 1).map(city => (
            <p key={city}>{city}</p>
          ))}

          {trip.cities.length > 1 && (
            <p className='more-count'>+{trip.cities.length - 1}</p>
          )}
        </div>
        <div className='statistic'>
          <div className='stat-part'>
            <p className='head'>Days</p>
            <p className='num'>{trip.days}</p>
          </div>
          <div className='stat-part'>
            <p className='head'>People</p>
            <p className='num'>{trip.people}</p>
          </div>
          <div className='stat-part'>
            <p className='head'>Budget</p>
            <p className='num'>€{trip.budget}</p>
          </div>
          <div className='stat-part'>
            <p className='head'>Likes</p>
            <p className='num'>{trip.likes}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Trip