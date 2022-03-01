# frozen_string_literal: true

# rubocop:disable Layout/LineLength:
desc 'Update Assignees on DRC Task Template'
task update_drc_template_assignees: :environment do
  community = Community.find_by(name: 'Tilisi')
  abort('DoubleGDP community is needed') if community.blank?

  ordered_list_of_subtask_assignees = [
    {
      subTasks: [
        {
          title: 'Site plans',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'],
        },
        { title: 'Elevations',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: '3D Renders',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Building Plot ratio(in relation to the total land purchased)',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Building Ground coverage',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
      ],
    },
    {
      subTasks: [
        { title: 'Letter of appointment for the consultant from the Owner',
          assignees: ['victor+2@doublegdp.com'] },
        { title: 'Design Concept Plans, sections and levels',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Indicative elevations or 3 dimensional renders showing all facades of the Buildings and/or Improvements',
          assignees: ['victor+2@doublegdp.com'] },
        { title: 'Overall gross buildable area, height and site controls (in line with the relevant Tilisi master plan)',
          assignees: ['victor+3@doublegdp.com'] },
        { title: 'Pedestrian and vehicular access and circulation',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Access to buildings, targeted number of parking bays and adherence to lines of no access',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Details on site storm water attenuation measures',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com'] },
      ],
    },
    {
      subTasks: [
        { title: 'A Site Plan: The site plan must contain all information submitted at Concept Plan stage, but modified to incorporate any changes to the proposal made at the instigation of the developer and approved by the DRC or at the direction of DRC.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Plans: Plans showing all of the floors, including roof plan, and indicating the proposed uses and dimensions for all indoor and outdoor spaces together with linkages to adjoining development or areas where appropriate. The roof plans shall be clearly annotated to show areas of public use and/or accessibility, and the location and type of any proposed roof top equipment (A/C units, tanks, telecommunication antennae, etc.).',
          assignees: ['victor+2@doublegdp.com'] },
        { title: 'Elevations or 3D renders: Elevations showing all facades of the buildings (including ancillary structures) and depicting all external material finishes.',
          assignees: ['victor+2@doublegdp.com'] },
        { title: 'Sections: At least two sections, through the buildings showing the internal-external floor levels, window sill heights, parapet heights, and the relationship of the proposed Buildings or Improvements to existing neighbouring development and the pavement levels contiguous to the development.',
          assignees: ['victor+2@doublegdp.com'] },
        { title: 'Subordinate Structures: All elevations, plans (including roof plans) and sections, as applicable, for all subordinate structures including transformer station, guard house if applicable, garbage/waste storage receptacle, landscape features, car parking, shade structures, signs, and lights, radio transmission and other aerials and any other structures that will be visible from public areas.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Fences and Walls: Detail drawings, including elevations for the whole site and sections of proposed transparent fences and solid boundary walls. The drawings shall show all openings (e.g., garbage/waste storage receptacles if to be included) together with details of meter boxes, lighting and any other wall mounted object.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Site and Buildings Signage Plan.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Area Calculations: A table of area calculations to permit ground coverage evaluation and a calculation to evaluate the Gross Developed Bulk in accordance with International Property measurement standards by Buildings Owners Managers Association (BOMA) International.',
          assignees: ['victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Grading and Surface Water Drainage drawings and calculations.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com'] },
        { title: 'Cross Sections: Two cross-sections through the site in each main direction (i.e. 4 sections) showing proposed finished levels in relation to the existing surface level with areas of cut and fill emphasized by shading. Drainage flow must be shown to an approved storm water inlet.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com'] },
        { title: 'A Landscape Plan: Landscape plan indicating the numbers, species, sizes and positions of all trees, shrubs, ground cover plants and lawn areas, such planting to be related to the estimated irrigation water demand calculations. The landscape plan shall also identify and describe all hard landscape surfaces and any landscape features including sculptures and water features.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'A Utility Layout Plan: Utility plan showing the coordinates, depths, and levels and sizes of all pipes, conduits and connections in respect to potable and irrigation water, sewer, telephone, electricity, from the points of entrance to the site to the centers of distribution, including location of transformer station, switch room and meters and the location of any proposed standby generator.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Electricity Calculations and Diagrams: Final electricity load calculations for the development expressed in KVA not exceeding the load previously approved pursuant to the Concept Plan, together with a single line diagram showing details of circuit breakers.',
          assignees: ['victor+1@doublegdp.com'] },
        { title: 'Parking Plan: Parking spaces shall not be used for permanent or temporary storage of junk vehicles, private vehicles offered for sale, house trailers or public service vehicles. Each Parcel must provide adequate off- street parking, including basement parking where required by the Structure Plan. All parking requirements are subject to the requirements of the approved Structure Plan and the applicable Laws of Kenya and the by-laws of the relevant local authority.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Garbage/Waste Calculations and Plans: A calculation showing the anticipated garbage/waste generation in cubic meters (M3), together with plans showing the provision to be made for garbage/waste storage and disposal.
        All Owners shall submit a solid waste management strategy, together with submission of building plans to the DRC, without which the DRC shall not approve any Improvement plan submission.
        The solid waste management strategy shall conform to the requirements of the EIA for the Parcel and to the Project’s waste management plan and the Improvement specific EIA, and shall address solid waste management during construction and following use or occupation of the Improvements.
        The Vendor shall have the right to dispose of waste in accordance with the Vendor’s standards including
        but not limited to disposal in National Environment',
          assignees: ['projects@tilisi.co.ke', 'victor+3@doublegdp.com'] },
        { title: 'Certificates: Certificates issued by a duly qualified engineer attesting to the matters specified hereunder. In addition, DRC may require the submission of all architectural and engineering documents, including structural calculations, drawings and detailed service layouts prepared or examined by the Engineer in the course of preparing and issuing his certificate.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
        { title: 'Overall Integrity of the Development: The Owner shall be required to submit documents to confirm the adequacy of the structural design of the proposed Buildings or Improvements and their structural integrity, the conformity with the Building Regulations and other applicable, plumbing, electrical, telecommunications and water systems regulations and the adequacy of all other technical provisions to guarantee the safety and security of users of the development.',
          assignees: ['projects@tilisi.co.ke', 'victor+2@doublegdp.com', 'victor+3@doublegdp.com'] },
      ],
    },
  ]

  ActiveRecord::Base.transaction do
    ordered_list_of_subtask_assignees.each do |l|
      l[:subTasks].each do |sub_task|
        task = community.notes.find_by(body: sub_task[:title], category: 'template')
        next if task.blank?

        sub_task[:assignees].each do |e|
          user = community.users.find_by(email: e)
          next if user.blank?

          task.assign_or_unassign_user(user.id)
        end
      end
    end

    puts 'Assignees Updated Successfully.'
  end
end
# rubocop:enable Layout/LineLength:
