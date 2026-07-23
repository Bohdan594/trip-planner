import './TripsSection.scss'
import AddTrip from './AddTrip'
import TripsList from './TripsList'
import { useState, useEffect } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { useAppSelector } from '../../store/hooks'
import { getTripsThunk } from '../../store/trips/tripsSlice'
import TripsSkeleton from '../SkeletonLoaders/TripsSkeleton'
import CreateTripModal from './CreateTripModal'

function TripsSection() {
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(state => state.trips.fetchStatus);
  const [modalAddTrip, setModalAddTrip] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [buttonType, setButtonType] = useState<string>('All');

  useEffect(() => {
    const fetchTrips = async () => {
      if (fetchStatus !== 'loading') {
        return
      }

      try {
        await dispatch(getTripsThunk()).unwrap();
      } catch (err : unknown) {
        if (typeof err === 'string') {
          setError(err);
        } else {
          setError('Something went wrong');
        }
      }
    }

    fetchTrips();
  }, []);

  if (fetchStatus === 'loading') {
    return <TripsSkeleton />;
  }

  if (error) {
    return <p className='fetch-trips-error'>{error}</p>;
  }

  return (
    <>
      <section className='trips-section'>
        <AddTrip onClick={() => setModalAddTrip(true)}
          buttonType={buttonType}
          setButtonType={setButtonType} />
        <CreateTripModal 
          isOpen={modalAddTrip}
          onClose={() => setModalAddTrip(false)}
        />
        <TripsList buttonType={buttonType} />
      </section>
    </>
  )

}

export default TripsSection