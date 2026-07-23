import './AddTrip.scss'

type AddTripProps = {
  onClick: () => void;
  buttonType: string;
  setButtonType: (type: string) => void;
};

function AddTrip({ onClick, buttonType, setButtonType }: AddTripProps) {

  return (
    <>
      <section className='trip-head'>
        <div className='add-trip'>
            <p>0 trips</p>
            <button onClick={onClick}>+ Add trip</button>
        </div>
        <div className='types'>
          <p onClick={() => setButtonType('All')} className={`${buttonType === 'All' ? 'active' : ''}`}>All</p>
          <p onClick={() => setButtonType('Single-trips')} className={`${buttonType === 'Single-trips' ? 'active' : ''}`}>Single trips</p>
          <p onClick={() => setButtonType('Group-trips')} className={`${buttonType === 'Group-trips' ? 'active' : ''}`}>Group trips</p>
        </div>
      </section>
    </>
  )

}

export default AddTrip