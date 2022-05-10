# frozen_string_literal: true

# rubocop:disable Layout/LineLength:
desc 'Generate DRC Task Template and Form'
task :generate_drc_task_template, %i[author_email] => :environment do |_t, args|
  abort('Provide a valid author email') if args.author_email.blank?

  # Migrate only for demo community
  community = Community.find_by(name: 'DoubleGDP')
  abort('DoubleGDP community is needed') if community.blank?

  author = community.users.find_by(email: args.author_email)
  abort('Template author not found in community') if author.blank?

  drc_template = [
    {
      parentTask: 'Concept Design Review',
      subTasks: [
        'Site plans',
        'Elevations',
        '3D Renders',
        'Building Plot ratio(in relation to the total land purchased)',
        'Building Ground coverage',
      ],
    },
    {
      parentTask: 'Scheme Design Review',
      subTasks: [
        'Letter of appointment for the consultant from the Owner',
        'Design Concept Plans, sections and levels',
        'Indicative elevations or 3 dimensional renders showing all facades of the Buildings and/or Improvements',
        'Overall gross buildable area, height and site controls (in line with the relevant Tilisi master plan)',
        'Access to buildings, targeted number of parking bays and adherence to lines of no access',
        'Details on site storm water attenuation measures',
      ],
    },
    {
      parentTask: 'Detailed Design Review',
      subTasks: [
        'A Site Plan: The site plan must contain all information submitted at Concept Plan stage, but modified to incorporate any changes to the proposal made at the instigation of the developer and approved by the DRC or at the direction of DRC.',
        'Plans: Plans showing all of the floors, including roof plan, and indicating the proposed uses and dimensions for all indoor and outdoor spaces together with linkages to adjoining development or areas where appropriate. The roof plans shall be clearly annotated to show areas of public use and/or accessibility, and the location and type of any proposed roof top equipment (A/C units, tanks, telecommunication antennae, etc.).',
        'Elevations or 3D renders: Elevations showing all facades of the buildings (including ancillary structures) and depicting all external material finishes.',
        'Sections: At least two sections, through the buildings showing the internal-external floor levels, window sill heights, parapet heights, and the relationship of the proposed Buildings or Improvements to existing neighbouring development and the pavement levels contiguous to the development.',
        'Subordinate Structures: All elevations, plans (including roof plans) and sections, as applicable, for all subordinate structures including transformer station, guard house if applicable, garbage/waste storage receptacle, landscape features, car parking, shade structures, signs, and lights, radio transmission and other aerials and any other structures that will be visible from public areas.',
        'Fences and Walls: Detail drawings, including elevations for the whole site and sections of proposed transparent fences and solid boundary walls. The drawings shall show all openings (e.g., garbage/waste storage receptacles if to be included) together with details of meter boxes, lighting and any other wall mounted object.',
        'Site and Buildings Signage Plan.',
        'Area Calculations: A table of area calculations to permit ground coverage evaluation and a calculation to evaluate the Gross Developed Bulk in accordance with International Property measurement standards by Buildings Owners Managers Association (BOMA) International.',
        'Grading and Surface Water Drainage drawings and calculations.',
        'Cross Sections: Two cross-sections through the site in each main direction (i.e. 4 sections) showing proposed finished levels in relation to the existing surface level with areas of cut and fill emphasized by shading. Drainage flow must be shown to an approved storm water inlet.',
        'A Landscape Plan: Landscape plan indicating the numbers, species, sizes and positions of all trees, shrubs, ground cover plants and lawn areas, such planting to be related to the estimated irrigation water demand calculations. The landscape plan shall also identify and describe all hard landscape surfaces and any landscape features including sculptures and water features.',
        'A Utility Layout Plan: Utility plan showing the coordinates, depths, and levels and sizes of all pipes, conduits and connections in respect to potable and irrigation water, sewer, telephone, electricity, from the points of entrance to the site to the centers of distribution, including location of transformer station, switch room and meters and the location of any proposed standby generator.',
        'Electricity Calculations and Diagrams: Final electricity load calculations for the development expressed in KVA not exceeding the load previously approved pursuant to the Concept Plan, together with a single line diagram showing details of circuit breakers.',
        'Parking Plan: Parking spaces shall not be used for permanent or temporary storage of junk vehicles, private vehicles offered for sale, house trailers or public service vehicles. Each Parcel must provide adequate off- street parking, including basement parking where required by the Structure Plan. All parking requirements are subject to the requirements of the approved Structure Plan and the applicable Laws of Kenya and the by-laws of the relevant local authority.',
        'Garbage/Waste Calculations and Plans: A calculation showing the anticipated garbage/waste generation in cubic meters (M3), together with plans showing the provision to be made for garbage/waste storage and disposal.
        All Owners shall submit a solid waste management strategy, together with submission of building plans to the DRC, without which the DRC shall not approve any Improvement plan submission.
        The solid waste management strategy shall conform to the requirements of the EIA for the Parcel and to the Project’s waste management plan and the Improvement specific EIA, and shall address solid waste management during construction and following use or occupation of the Improvements.
        The Vendor shall have the right to dispose of waste in accordance with the Vendor’s standards including
        but not limited to disposal in National Environment',
        'Certificates: Certificates issued by a duly qualified engineer attesting to the matters specified hereunder. In addition, DRC may require the submission of all architectural and engineering documents, including structural calculations, drawings and detailed service layouts prepared or examined by the Engineer in the course of preparing and issuing his certificate.',
        'Overall Integrity of the Development: The Owner shall be required to submit documents to confirm the adequacy of the structural design of the proposed Buildings or Improvements and their structural integrity, the conformity with the Building Regulations and other applicable, plumbing, electrical, telecommunications and water systems regulations and the adequacy of all other technical provisions to guarantee the safety and security of users of the development.',
      ],
    },
    {
      parentTask: 'Kiambu County Submission',
      subTasks: [],
    },
    {
      parentTask: 'Signing of contractor Code of Conduct',
      subTasks: [],
    },
    {
      parentTask: 'Construction Starts',
      subTasks: [],
    },
    {
      parentTask: 'Inspections',
      subTasks: [],
    },
    {
      parentTask: 'Post Construction',
      subTasks: [],
    },
  ]

  ActiveRecord::Base.transaction do
    drc_template.reverse.each do |t|
      # create parent task
      parent_task = community.notes.create!(
        body: t[:parentTask],
        category: 'template',
        flagged: true,
        author_id: author[:id],
        user_id: author[:id],
        completed: false,
        parent_note_id: nil,
      )

      t[:subTasks].each do |sub_task_title|
        community.notes.create!(
          body: sub_task_title,
          category: 'template',
          flagged: true,
          author_id: author[:id],
          user_id: author[:id],
          completed: false,
          parent_note_id: parent_task[:id],
        )
      end
    end

    # Create a DRC Process Form if not already exists
    form_name = 'DRC Project Review Process'
    form_not_found = community.forms.find_by(name: form_name).blank?

    if form_not_found
      form = community.forms.new(
        name: form_name,
        preview: false,
        multiple_submissions_allowed: true,
        description: 'DRC Project Review Process',
      )
      if form.save
        author.generate_events('form_create', form)
        form.update!(grouping_id: form.id)
      end
    end

    puts "Template generated Successfully. #{form_name} created successfully"
  end
end
# rubocop:enable Layout/LineLength:
