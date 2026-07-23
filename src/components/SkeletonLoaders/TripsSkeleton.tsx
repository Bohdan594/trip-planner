import './TripsSkeleton.scss'

function TripsSkeleton() {

    const CARD_HEIGHT = 377;
    const HEADER_HEIGHT = 140;
    const CARD_WIDTH = 260;

    const rows = Math.ceil((window.innerHeight - HEADER_HEIGHT) / CARD_HEIGHT);
    const columns = Math.max(1, Math.floor(window.innerWidth / CARD_WIDTH));

    const skeletonCount = rows * columns + columns;

    return (
        <div className='trips-skeleton'>
            <div className='header-skel'>
                <div className='skel-add-trip'>
                    <div className='skel skel-count'/>
                    <div className='skel skel-button'/>
                </div>
                <div className='skel-types'>
                    <div className='skel skel-all'/>
                    <div className='skel skel-single'/>
                    <div className='skel skel-group'/>
                </div>
            </div>
            <div className='trips-skel'>
                 {Array.from({ length: skeletonCount }).map((_, i) => (
                    <div key={i} className='trip-skel'>
                        <div className='skel skel-departure'/>
                        <div className='skel skel-city'/>
                        <div className='skel-stats'>
                            {[...Array(4)].map((_, i) => (<div key={i} className='skel skel-stat'/>))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TripsSkeleton