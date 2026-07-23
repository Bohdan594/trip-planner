import './AccountSkeleton.scss'

function AccountSkeleton() {
    return (
        <div className='account-skeleton'>
            <div className='header-skel'>
                <div className='skel skel-title' />
                <div className='skel skel-subtitle' />
            </div>
            <div className='main-skel'>
                <div className='manage-skel'>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className='part-skel'>
                            <div className='left-skel'>
                                <div className='skel skel-circle' />
                                <div className='info-skel'>
                                    <div className='skel skel-head' />
                                    <div className='skel skel-info' />
                                </div>
                            </div>
                            <div className='skel skel-btn' />
                        </div>
                    ))}
                </div>
                <div className='stay-skel'>
                    <div className='skel skel-circle' />
                    <div className='info-skel'>
                        <div className='skel skel-head' />
                        <div className='skel skel-info' />
                        <div className='skel skel-info skel-info--short' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSkeleton