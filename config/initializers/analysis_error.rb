module GraphQL
    class VisibilityError < GraphQL::ExecutionError
      # @return [Hash] An entry for the response's "errors" key
      def to_h
        hash = {
          "message" => message,
          "code" => 401
        }
        if ast_node
          hash["locations"] = [
            {
              "line" => ast_node.line,
              "column" => ast_node.col,
            }
          ]
        end
        if path
          hash["path"] = path
        end
        if options
          hash.merge!(options)
        end
        if extensions
          hash["extensions"] ||= {}
          hash["extensions"].merge!(extensions)
        end
        hash
      end
    end
  end