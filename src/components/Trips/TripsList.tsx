import './TripsList.scss'
import Trip from './Trip.tsx'
import { useAppSelector } from '../../store/hooks';

type TripsListProps = {
  buttonType: string;
};

function TripsList({ buttonType }: TripsListProps) {

  const trips = useAppSelector(state => state.trips.trips);
  const tripsNew = trips.filter(trip => {
    switch (buttonType) {
      case 'Single-trips':
        return trip.people === 1;
      case 'Group-trips':
        return trip.people > 1;
      default:
        return true;
    }
  });

  return (
    <>
      { tripsNew.length > 0 ?
        (<section className='trips'>
          {
            tripsNew.map(trip => (
              <Trip key={trip.id} trip={trip} />
            ))
          }
        </section>) :
        buttonType === 'Group-trips' ?
          (<p className='no-trips'>You have no group trips yet</p>) :
          buttonType === 'Single-trips' ?
          (<p className='no-trips'>You have no single trips yet</p>) :
          (<p className='no-trips'>You have no trips yet</p>)
      }
    </>
  )

}

export default TripsList