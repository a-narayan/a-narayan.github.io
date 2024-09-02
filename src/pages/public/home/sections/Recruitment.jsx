import React from 'react'
import { DText, Description, SectionWrapper } from '../../../../components'

const Recruitment = () => {
    return (
        <SectionWrapper>
            <Description
                heading={'Recruitment'}
                data={[
                    'Please see our publications list for more information on our research. Our team members and some examples of current and past projects are also available on our team page. We upload our presentations and workshops to the resources page.',
                    'Our group is recruiting year-round for postdocs, MASc and PhD students, visiting students and undergraduate students. All admitted students will receive a stipend. If you are interested in pursuing research or graduate studies, please email Dr. Apurva Narayan a copy of your:',
                    ['CV', 'Research Statement', 'Sample work (if applicable)']
                ]} />
        </SectionWrapper>
    )
}

export default Recruitment
