# frozen_string_literal: true

# rubocop:disable Layout/LineLength:
# rubocop:disable Rails/SkipsModelValidations
desc 'Update Existing DRC Task Template Descriptions'
task :update_drc_task_template_descriptions, %i[community_name] => :environment do |_t, args|
  abort('Provide a valid Community Name') if args.community_name.blank?

  # Migrate per community basis
  community = Community.find_by(name: args.community_name)
  abort('Community is undefined') if community.blank?

  # NB: We don't have field `order` on tasks table. This is just a visual pointer for a follow up, incase we need to update existing task in DB create from templates.
  updated_templates = [
    {
      order: 1,
      parent: 'Concept Design Review',
      sub_tasks: [
        {
          body: 'Site plans',
          description: 'Site plans',
          order: 1,
        },
        {
          body: 'Elevations',
          description: 'Elevations',
          order: 2,
        },
        {
          body: '3D Renders',
          description: '3D Renders',
          order: 3,
        },
        {
          body: 'Building Plot ratio(in relation to the total land purchased)',
          description: 'Building Plot ratio(in relation to the total land purchased)',
          order: 4,
        },
        {
          body: 'Building Ground coverage',
          description: 'Building Ground coverage',
          order: 5,
        },
      ],
    },
    {
      order: 2,
      parent: 'Scheme Design Review',
      sub_tasks: [
        {
          body: 'Letter of appointment for the consultant from the Owner',
          description: 'Letter of appointment for the consultant from the Owner',
          order: 1,
        },
        {
          body: 'Design Concept Plans, sections and levels',
          description: 'Design Concept Plans, sections and levels',
          order: 2,
        },
        {
          body: 'Indicative elevations or 3 dimensional renders showing all facades of the Buildings and/or Improvements',
          description: 'Indicative elevations or 3 dimensional renders showing all facades of the Buildings and/or Improvements',
          order: 3,
        },
        {
          body: 'Overall gross buildable area, height and site controls (in line with the relevant Tilisi master plan)',
          description: 'Overall gross buildable area, height and site controls (in line with the relevant Tilisi master plan)',
          order: 4,
        },
        {
          body: 'Access to buildings, targeted number of parking bays and adherence to lines of no access',
          description: 'Access to buildings, targeted number of parking bays and adherence to lines of no access',
          order: 5,
        },
        {
          body: 'Details on site storm water attenuation measures',
          description: 'Details on site storm water attenuation measures',
          order: 6,
        },
        {
          body: 'Pedestrian and vehicular access and circulation',
          description: 'Pedestrian and vehicular access and circulation',
          order: 7,
        },
      ],
    },
    {
      order: 3,
      parent: 'Detailed Design Review',
      sub_tasks: [
        {
          body: 'A Site Plan',
          description: 'The site plan must contain all information submitted at Concept Plan stage, but modified to incorporate any changes to the proposal made at the instigation of the developer and approved by the DRC or at the direction of DRC.',
          order: 1,
        },
        {
          body: 'Plans',
          description: 'Plans showing all of the floors, including roof plan, and indicating the proposed uses and dimensions for all indoor and outdoor spaces together with linkages to adjoining development or areas where appropriate. The roof plans shall be clearly annotated to show areas of public use and/or accessibility, and the location and type of any proposed roof top equipment (A/C units, tanks, telecommunication antennae, etc.).',
          order: 2,
        },
        {
          body: 'Elevations or 3D renders',
          description: 'Elevations showing all facades of the buildings (including ancillary structures) and depicting all external material finishes.',
          order: 3,
        },
        {
          body: 'Sections',
          description: 'At least two sections, through the buildings showing the internal-external floor levels, window sill heights, parapet heights, and the relationship of the proposed Buildings or Improvements to existing neighbouring development and the pavement levels contiguous to the development.',
          order: 4,
        },
        {
          body: 'Subordinate Structures',
          description: 'All elevations, plans (including roof plans) and sections, as applicable, for all subordinate structures including transformer station, guard house if applicable, garbage/waste storage receptacle, landscape features, car parking, shade structures, signs, and lights, radio transmission and other aerials and any other structures that will be visible from public areas.',
          order: 5,
        },
        {
          body: 'Fences and Walls',
          description: 'Detail drawings, including elevations for the whole site and sections of proposed transparent fences and solid boundary walls. The drawings shall show all openings (e.g., garbage/waste storage receptacles if to be included) together with details of meter boxes, lighting and any other wall mounted object.',
          order: 6,
        },
        {
          body: 'Site and Buildings Signage Plan.',
          description: 'Site and Buildings Signage Plan.',
          order: 7,
        },
        {
          body: 'Area Calculations',
          description: 'A table of area calculations to permit ground coverage evaluation and a calculation to evaluate the Gross Developed Bulk in accordance with International Property measurement standards by Buildings Owners Managers Association (BOMA) International.',
          order: 8,
        },
        {
          body: 'Grading and Surface Water Drainage drawings and calculations.',
          description: 'Grading and Surface Water Drainage drawings and calculations.',
          order: 9,
        },
        {
          body: 'Cross Sections',
          description: 'Two cross-sections through the site in each main direction (i.e. 4 sections) showing proposed finished levels in relation to the existing surface level with areas of cut and fill emphasized by shading. Drainage flow must be shown to an approved storm water inlet.',
          order: 10,
        },
        {
          body: 'A Landscape Plan',
          description: 'Landscape plan indicating the numbers, species, sizes and positions of all trees, shrubs, ground cover plants and lawn areas, such planting to be related to the estimated irrigation water demand calculations. The landscape plan shall also identify and describe all hard landscape surfaces and any landscape features including sculptures and water features.',
          order: 11,
        },
        {
          body: 'A Utility Layout Plan',
          description: 'Utility plan showing the coordinates, depths, and levels and sizes of all pipes, conduits and connections in respect to potable and irrigation water, sewer, telephone, electricity, from the points of entrance to the site to the centers of distribution, including location of transformer station, switch room and meters and the location of any proposed standby generator.',
          order: 12,
        },
        {
          body: 'Electricity Calculations and Diagrams',
          description: 'Final electricity load calculations for the development expressed in KVA not exceeding the load previously approved pursuant to the Concept Plan, together with a single line diagram showing details of circuit breakers.',
          order: 13,
        },
        {
          body: 'Parking Plan',
          description: 'Parking spaces shall not be used for permanent or temporary storage of junk vehicles, private vehicles offered for sale, house trailers or public service vehicles. Each Parcel must provide adequate off- street parking, including basement parking where required by the Structure Plan. All parking requirements are subject to the requirements of the approved Structure Plan and the applicable Laws of Kenya and the by-laws of the relevant local authority.',
          order: 14,
        },
        {
          body: 'Garbage/Waste Calculations and Plans',
          description: 'A calculation showing the anticipated garbage/waste generation in cubic meters (M3), together with plans showing the provision to be made for garbage/waste storage and disposal.
          All Owners shall submit a solid waste management strategy, together with submission of building plans to the DRC, without which the DRC shall not approve any Improvement plan submission.
          The solid waste management strategy shall conform to the requirements of the EIA for the Parcel and to the Project’s waste management plan and the Improvement specific EIA, and shall address solid waste management during construction and following use or occupation of the Improvements.
          The Vendor shall have the right to dispose of waste in accordance with the Vendor’s standards including
          but not limited to disposal in National Environment',
          order: 15,
        },
        {
          body: 'Certificates',
          description: 'Certificates issued by a duly qualified engineer attesting to the matters specified hereunder. In addition, DRC may require the submission of all architectural and engineering documents, including structural calculations, drawings and detailed service layouts prepared or examined by the Engineer in the course of preparing and issuing his certificate.',
          order: 16,
        },
        {
          body: 'Overall Integrity of the Development',
          description: 'The Owner shall be required to submit documents to confirm the adequacy of the structural design of the proposed Buildings or Improvements and their structural integrity, the conformity with the Building Regulations and other applicable, plumbing, electrical, telecommunications and water systems regulations and the adequacy of all other technical provisions to guarantee the safety and security of users of the development.',
          order: 17,
        },
      ],
    },
    {
      order: 4,
      parent: 'Kiambu County Submission',
    },
    {
      order: 5,
      parent: 'Signing of contractor Code of Conduct',
    },
    {
      order: 6,
      parent: 'Construction Starts',
      sub_tasks: [],
    },
    {
      order: 7,
      parent: 'Inspections',
      sub_tasks: [],
    },
    {
      order: 8,
      parent: 'Post Construction',
      sub_tasks: [],
    },
  ]

  ActiveRecord::Base.transaction do
    updated_templates.each_with_index do |t, i|
      template = community.notes
                          .find_by(
                            body: t[:parent],
                            category: 'template',
                            parent_note_id: nil,
                          )

      # return subtasks_ordered
      ordered_sub_tasks = community.notes.unscoped
                                   .where(parent_note_id: template[:id])
                                   .order(created_at: :asc)

      ordered_sub_tasks.each_with_index do |sub_t, index|
        body_to_update = updated_templates[i][:sub_tasks][index][:body]
        description_to_update = updated_templates[i][:sub_tasks][index][:description]
        body_already_exists = ordered_sub_tasks.find_by(body: body_to_update)

        sub_t.update_column(:body, body_to_update) if body_already_exists.blank?

        sub_t.update_column(:description, description_to_update)
      end
    end

    puts 'Tasks updated successfully'
  end
end
# rubocop:enable Rails/SkipsModelValidations
# rubocop:enable Layout/LineLength:
